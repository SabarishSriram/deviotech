import { finalReviewTask, mergedLine, planTask, readmeTask } from "@/data/docs/build/shared"
import type { BuildTask, BuildWeek, ProjectBuild, ProjectScreen } from "@/data/docs/types"

/*
 * AI & ML: three projects, week by week, built on the my-ml-project repo
 * from Setup (Python .venv, pandas, scikit-learn, JupyterLab, config.py
 * reading .env). Notebooks to explore; app/ for the code that serves it.
 */

/* ------------------------------------------------------------------ */
/* Shared tasks                                                        */
/* ------------------------------------------------------------------ */

const venv = { text: "Every time: open a terminal in the project and check the prompt starts with (.venv). If it doesn't, switch it on as in Setup." }

function edaTask(opts: { load: string; explore: string; screens?: string[] }): BuildTask {
  return {
    id: "eda",
    title: "Explore and clean the data",
    why: "Every model is only as good as its data. Before training anything, look at the data until you know its shape, its gaps and its traps.",
    branch: "feat/eda",
    screens: opts.screens,
    prompt: `In a notebook, notebooks/01-eda.ipynb: ${opts.load} Then help me explore it one question at a time — ${opts.explore} After each cell, tell me what the output means and what I should look at next. Don't write the whole notebook at once.`,
    steps: [venv, { text: "Get the dataset by following Reference → Sample data in the sidebar, and save it in data/raw/. Make sure data/raw/ is in .gitignore." }, { text: "Start JupyterLab and create notebooks/01-eda.ipynb:", code: "jupyter lab" }],
    understand: ["What did you find that would trip up a model if you hadn't looked?", "Which cleaning step changed the data the most, and why was it needed?", "Is the data balanced? What does that mean for your metric?"],
    check: [{ text: "Restart the kernel and run all cells (Kernel → Restart Kernel and Run All Cells): it runs top to bottom with no errors, and each chart has a one-line note under it saying what it shows." }],
    debug: ["UnicodeDecodeError when reading the CSV: add encoding=\"latin-1\" to pd.read_csv.", "ModuleNotFoundError in Jupyter: JupyterLab was started outside the .venv. Close it, switch on the .venv and start it again."],
    commit: "Add EDA notebook",
  }
}

function compareTask(opts: { models: string; metric: string }): BuildTask {
  return {
    id: "compare",
    title: "Compare models properly",
    why: "One model's score means nothing alone. Comparing a few — fairly, with cross-validation and the right metric — is how you know which one is actually better.",
    branch: "feat/models",
    screens: ["models"],
    prompt: `In notebooks/03-models.ipynb, using the same train/test split as my baseline: train ${opts.models} as scikit-learn Pipelines, compare them with 5-fold cross-validation on the training set using ${opts.metric}, tune the best one with GridSearchCV, and only then score it once on the test set. Make a comparison table (model, mean score, standard deviation, training time) and a confusion matrix for the winner. Explain each step before the code.`,
    steps: [venv],
    understand: ["Why is the test set used only once, at the very end?", "What does the standard deviation across folds tell you?", "Read your confusion matrix out loud: which mistake does the model make most?"],
    check: [{ text: "The notebook ends with a comparison table and a confusion matrix, and Restart Kernel and Run All works." }],
    commit: "Compare models",
  }
}

function saveAndServeTask(opts: { endpoint: string; input: string; output: string }): BuildTask {
  return {
    id: "api",
    title: "Save the model and serve it with FastAPI",
    why: "A model in a notebook helps nobody. Save it to one file, then load that same file behind an API that any app can call.",
    branch: "feat/api",
    screens: ["api"],
    prompt: `Save my best pipeline with joblib to models/model.joblib (from the notebook). Then write app/api.py with FastAPI: load the model once at startup, and add ${opts.endpoint} that takes ${opts.input} (validated with a Pydantic model) and returns ${opts.output}. Add GET /health. Add tests in tests/test_api.py with FastAPI's TestClient.`,
    steps: [venv, { text: "Install what you need, then update requirements.txt (as in Setup):", code: "pip install \"fastapi[standard]\" pytest httpx" }, { text: "Run the API, then open http://localhost:8000/docs to try it:", code: "fastapi dev app/api.py" }],
    understand: ["Why load the model once at startup instead of on every request?", "What does Pydantic do with a request that's missing a field?", "Why is the same model file used by the API and, later, the app?"],
    check: [{ text: "In /docs, send a real example through the endpoint — you get a sensible answer back." }, { text: "Run the tests:", code: "python -m pytest", expect: "they pass" }],
    debug: ["“No such file models/model.joblib”: run the notebook cell that saves it, and run fastapi from the project folder, not from app/."],
    commit: "Serve the model with FastAPI",
  }
}

function streamlitTask(opts: { what: string; screens: string[] }): BuildTask {
  return {
    id: "app",
    title: "Streamlit app, live",
    why: "Streamlit turns Python into a web page in a few lines — and Streamlit Community Cloud puts it online for free, so anyone can try your project.",
    branch: "feat/streamlit",
    screens: opts.screens,
    prompt: `Write app/streamlit_app.py: ${opts.what} It loads models/model.joblib directly (cached with st.cache_resource). Show a spinner while it works, and a friendly message for empty input. Add a short “How it works and its limits” section at the bottom.`,
    steps: [
      venv,
      { text: "Install Streamlit, update requirements.txt, and run it:", code: "pip install streamlit\nstreamlit run app/streamlit_app.py" },
      { text: "Commit models/model.joblib if it's under 100 MB (otherwise ask your mentor). Then follow Building → Deployment to deploy on Streamlit Community Cloud. Secrets like LLM_API_KEY go in the app's Secrets settings — never in the repo." },
    ],
    understand: ["What does st.cache_resource do, and what would happen without it?", "Where does the live app get its secrets?", "What limitation would you warn a real user about?"],
    check: [{ text: "Open your live Streamlit URL in a private window and use it end to end." }],
    debug: ["The live app crashes with ModuleNotFoundError: the package is missing from requirements.txt. Add it, commit, and the app redeploys."],
    commit: "Add Streamlit app",
  }
}

function shipWeek(name: string, app: BuildTask, doneWhen: string[]): BuildWeek {
  return {
    intro: "Ship it: a live Streamlit app, a README that's honest about your metrics and limits, and the final review.",
    tasks: [
      app,
      readmeTask({ name, sections: "the live app link, your results table (with the metric you chose and why), how it works in five steps, how to run it locally, limitations and possible bias, environment variables (names only)", demo: "use the live app with a few real examples, including one it gets wrong", check: "The live app, results table and demo video are all in the README." }),
      finalReviewTask(doneWhen, "your live app"),
    ],
    done: ["The app is live", "The README has your metrics and limits", "The demo video is linked", "Your mentor has the links for the final review"],
  }
}

/* ------------------------------------------------------------------ */
/* Resume screener                                                     */
/* ------------------------------------------------------------------ */

const resumeDone = ["The README reports precision, recall and F1 on a held-out test set.", "Each score comes with a human-readable explanation.", "The Streamlit app is live.", "Limitations and possible bias are written down honestly."]

const resumeScreener: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — especially how you'll measure success — then explore and clean the resumes.",
    tasks: [
      planTask({
        parts: ["Success — your main metric for the category classifier, and why that one (not just accuracy).", "Pipeline — the steps from raw resume text to a score and an explanation."],
        questions: ["Why isn't accuracy enough here?", "What could make this tool unfair to some candidates?"],
      }),
      edaTask({ load: "load the resume dataset from data/raw/ with pandas, and clean the text (lowercase, remove URLs, emails, phone numbers and extra spaces) in a function in app/text.py that the notebook imports.", explore: "how many resumes per category, how long they are, the most common words per category, and empty or duplicate resumes.", screens: ["eda"] }),
    ],
    done: ["docs/plan.md with your metric and pipeline", "notebooks/01-eda.ipynb runs top to bottom", "Text cleaning lives in app/text.py", mergedLine],
  },
  {
    intro: "Classical ML: a similarity baseline for matching, then a fair comparison of classifiers for the category.",
    tasks: [
      {
        id: "baseline",
        title: "Baseline: TF-IDF matching",
        why: "Start with the simplest thing that could work. Every fancier idea has to beat this number.",
        branch: "feat/baseline",
        prompt: "In notebooks/02-baseline.ipynb, explain TF-IDF and cosine similarity in simple words, then score each resume against a job description I write (e.g. a Data Scientist role) and show the top 10. Put the scoring in app/match.py as a function score(job_text, resume_text) -> float between 0 and 100. Then split the data into train and test sets (stratified by category, random_state=42) and save the split.",
        steps: [venv],
        understand: ["What does a TF-IDF weight say about a word?", "Why stratify the split by category?", "Read the top 3 matches: do they make sense? Why or why not?"],
        check: [{ text: "The top 10 for your Data Scientist description are mostly data science resumes." }],
        commit: "Add TF-IDF matching baseline",
      },
      compareTask({ models: "logistic regression, linear SVM and Naive Bayes on TF-IDF features to predict the category", metric: "macro F1" }),
    ],
    done: ["A TF-IDF match score in app/match.py", "Three classifiers compared fairly, with a test score for the best", mergedLine],
  },
  {
    intro: "Make it explain itself, compare against embeddings, and put it behind an API.",
    tasks: [
      {
        id: "explain",
        title: "Explain every match",
        why: "A recruiter won't trust a number. They'll trust “matched: Python, SQL, Tableau; missing: Spark”.",
        branch: "feat/explain",
        prompt: "Write app/explain.py: given a job description and a resume, return the skills found in both, the job's skills missing from the resume, and the top TF-IDF terms they share. Use a small skills list in data/skills.txt (I'll start it; help me add common tech skills). Then, in a notebook, compare TF-IDF scores against sentence-embedding similarity (sentence-transformers, all-MiniLM-L6-v2) on 10 hand-picked pairs, and write which one you'd trust and why.",
        steps: [venv, { text: "Install sentence-transformers and update requirements.txt (it's large — give it a few minutes):", code: "pip install sentence-transformers" }],
        understand: ["Where does an explanation come from, step by step?", "Where did embeddings beat TF-IDF in your 10 pairs, and where didn't they?"],
        check: [{ text: "Run the explanation for one pair: the matched and missing skills are ones you agree with." }],
        commit: "Explain matches and compare embeddings",
      },
      saveAndServeTask({ endpoint: "POST /score", input: "job_description and resume_text", output: "a score 0–100, the predicted category, matched skills and missing skills" }),
    ],
    done: ["Every score has matched and missing skills", "A written comparison of TF-IDF and embeddings", "POST /score works, with tests", mergedLine],
  },
  shipWeek("Resume screener", streamlitTask({ what: "a text box for the job description, a file uploader for several resume .txt files (PDF optional), and a ranked table of score, predicted category and matched skills, with each row expandable to show its explanation.", screens: ["app"] }), resumeDone),
]

/* ------------------------------------------------------------------ */
/* Document Q&A bot (RAG)                                              */
/* ------------------------------------------------------------------ */

const qaDone = ["Answers cite their sources.", "Questions outside the documents get “I don't know”.", "The README reports your evaluation score.", "API keys are kept out of the repository."]

const documentQa: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words, pick your documents, and write the test questions before building anything.",
    tasks: [
      planTask({
        parts: ["Evaluation — how you'll decide if an answer is right, and how you'll check retrieval separately from the answer.", "Pipeline — the steps from a PDF to a cited answer: extract, chunk, embed, retrieve, generate."],
        questions: ["Why write the test questions before building?", "Why measure retrieval on its own?"],
      }),
      {
        id: "docs-eval",
        title: "Documents, text and test questions",
        why: "You can't improve what you don't measure. The test questions are your measuring stick for every change you make later.",
        branch: "feat/eval-set",
        prompt: "Help me extract text page by page from the PDFs in data/raw/ with pypdf, in notebooks/01-extract.ipynb: how many pages, how many characters per page, and any pages with no text (scanned images). Then help me check my data/eval.csv (question, expected_answer, page): are any questions ambiguous, or answerable without the documents? Include 3 questions the documents can't answer.",
        steps: [venv, { text: "Follow Reference → Sample data to choose 2–3 PDFs, put them in data/raw/, and write data/eval.csv yourself — 15–20 questions." }, { text: "Install the PDF reader and update requirements.txt:", code: "pip install pypdf" }],
        understand: ["Which of your questions is hardest, and why?", "What happens to a scanned page with no text layer?"],
        check: [{ text: "The notebook prints the text of any page you pick, and data/eval.csv has 15–20 questions, 3 of them unanswerable." }],
        commit: "Add documents check and evaluation set",
      },
    ],
    done: ["docs/plan.md with your evaluation plan", "Text extracts from every page", "data/eval.csv with 15–20 questions", mergedLine],
  },
  {
    intro: "Retrieval: chunk the text, embed it, index it — and measure whether the right passage comes back.",
    tasks: [
      {
        id: "index",
        title: "Chunk, embed and index",
        why: "The model can only answer from what you retrieve. Good chunks are the difference between a right answer and a confident wrong one.",
        branch: "feat/index",
        prompt: "Write app/index.py: split each page into chunks of about 800 characters with 100 overlapping, keeping the document name and page number with each chunk, and store them in a Chroma collection on disk (in data/index/, which must be in .gitignore) using Chroma's default embedding function. Add a function search(question, k=3) that returns the top chunks with their pages. Explain chunk size and overlap first.",
        steps: [venv, { text: "Install Chroma and update requirements.txt:", code: "pip install chromadb" }],
        understand: ["Why overlap the chunks?", "What's an embedding, in one sentence?", "Why keep the page number with every chunk?"],
        check: [{ text: "Ask search() one of your eval questions: the expected page is in the top 3." }],
        commit: "Add chunking, embeddings and search",
      },
      {
        id: "retrieval-eval",
        title: "Measure retrieval and tune the chunk size",
        why: "Now use your test questions: for how many does the right page come back in the top 3? Then change one thing and measure again.",
        branch: "feat/retrieval-eval",
        screens: ["eval"],
        prompt: "In notebooks/02-retrieval.ipynb: for each answerable question in data/eval.csv, run search() and check whether the expected page is in the top 3 (hit rate at 3). Then rebuild the index with chunk sizes 400 and 1200 and compare all three in a table. Explain what the results mean.",
        steps: [venv],
        understand: ["What's your hit rate at 3, and which questions missed?", "Why did the chunk size you picked win?"],
        check: [{ text: "The notebook ends with a table of hit rate for three chunk sizes, and your chosen size is set in app/index.py." }],
        commit: "Measure retrieval and tune chunk size",
      },
    ],
    done: ["Chunks are embedded and searchable", "Hit rate at 3 measured for three chunk sizes", mergedLine],
  },
  {
    intro: "Generation: answers from the retrieved passages only, with citations — and “I don't know” when the answer isn't there.",
    tasks: [
      {
        id: "answer",
        title: "Answers with citations",
        why: "The LLM writes the answer, but only from your passages — and it must say where each fact came from.",
        branch: "feat/answer",
        screens: ["chat"],
        prompt: "Write app/answer.py: answer(question) runs search(), then calls an LLM API (the one my mentor approved, with the key from config.LLM_API_KEY) with a prompt that says: answer only from these numbered passages, cite them like [p. 12], and reply exactly “I don't know” if they don't contain the answer. Return the answer and the cited pages. Then score it on data/eval.csv in a notebook: right answer, right citation, and “I don't know” on the 3 unanswerable ones.",
        steps: [venv, { text: "Put your API key in .env as LLM_API_KEY (never in code). Install the provider's Python SDK and update requirements.txt." }],
        understand: ["Read your prompt out loud: which line stops the model from making things up?", "How did it do on the 3 unanswerable questions?", "Roughly how much does one question cost?"],
        check: [{ text: "Your eval notebook prints a score, and every answer has at least one citation." }],
        debug: ["401 or “invalid API key”: the key isn't in .env, or config.py wasn't imported before the call."],
        commit: "Add answers with citations",
      },
      {
        ...saveAndServeTask({ endpoint: "POST /ask", input: "a question", output: "the answer and the cited pages" }),
        title: "Serve it with FastAPI",
        why: "Your Q&A in a notebook helps nobody. Behind an API, any app can ask your documents a question.",
        prompt: "Write app/api.py with FastAPI: open the Chroma index in data/index/ once at startup, and add POST /ask that takes a question (validated with a Pydantic model), calls answer() from app/answer.py and returns the answer and cited pages. Add GET /health. Add tests in tests/test_api.py with FastAPI's TestClient that replace the LLM call with a fake, so tests don't cost money.",
        understand: ["Why open the index once at startup instead of on every request?", "Why do the tests replace the LLM call with a fake?", "What does Pydantic do with a request that's missing the question?"],
        debug: ["The API can't find the index: run fastapi from the project folder, and check data/index/ exists (build it with app/index.py first)."],
      },
    ],
    done: ["Answers cite their pages", "Unanswerable questions get “I don't know”", "An evaluation score you can quote", "POST /ask works, with tests", mergedLine],
  },
  shipWeek("Document Q&A bot", streamlitTask({ what: "a chat page with st.chat_input and st.chat_message that answers from my indexed documents, showing the cited pages under each answer in an expander. (It runs app/answer.py rather than a saved model, so skip the joblib line.)", screens: ["chat"] }), qaDone),
]

/* ------------------------------------------------------------------ */
/* Fake news classifier                                                */
/* ------------------------------------------------------------------ */

const newsDone = ["No leakage between training and test data.", "The README explains which metric you optimised and why.", "Predictions come with explanations.", "Limitations are clearly stated."]

const fakeNews: ProjectBuild = [
  {
    intro: "You've read Start here. Plan it in your own words — especially how you'll avoid leakage — then explore the data.",
    tasks: [
      planTask({
        parts: ["Metric — which mistake is worse here (calling real news fake, or fake news real), and the metric that follows from that.", "Leakage — how you'll make sure the same article or source never appears in both training and test."],
        questions: ["What is leakage, and why would it make your scores look too good?", "Which mistake is worse for a reader?"],
      }),
      edaTask({ load: "load Fake.csv and True.csv from data/raw/, add a label column, and combine them.", explore: "the balance of labels, article lengths, the subject column, duplicate titles, and any words or phrases (like “Reuters”) that appear almost only in one class — those are leakage clues.", screens: ["eda"] }),
    ],
    done: ["docs/plan.md with your metric and leakage plan", "notebooks/01-eda.ipynb runs top to bottom", "Leakage clues written down", mergedLine],
  },
  {
    intro: "Classical ML: a clean split, a baseline, and a fair comparison.",
    tasks: [
      {
        id: "baseline",
        title: "Clean split and baseline",
        why: "A split that leaks makes every later number a lie. Get the split right, then set the bar with the simplest model.",
        branch: "feat/baseline",
        prompt: "In notebooks/02-baseline.ipynb: remove duplicate articles, strip giveaway text like the “(Reuters) -” prefix, then split into train and test so no duplicate title is in both (stratified by label, random_state=42). Train TF-IDF + logistic regression, and show precision, recall, F1 and the confusion matrix. Explain each metric with an example from this data.",
        steps: [venv],
        understand: ["What did you remove to stop leakage, and how did the score change?", "Read the confusion matrix: how many real articles were called fake?"],
        check: [{ text: "The notebook shows the baseline's metrics and confusion matrix, and Restart Kernel and Run All works." }],
        commit: "Add clean split and baseline",
      },
      compareTask({ models: "logistic regression, multinomial Naive Bayes and a linear SVM (calibrated, so it gives probabilities) on TF-IDF features", metric: "the metric in my docs/plan.md" }),
    ],
    done: ["A leak-free split", "A baseline and two more models compared fairly", mergedLine],
  },
  {
    intro: "Explain predictions, test on news from somewhere else, and serve the model.",
    tasks: [
      {
        id: "explain",
        title: "Explanations and an outside test",
        why: "Which words pushed it to “fake”? And does it still work on headlines from sources it's never seen? Honest answers to both are the most valuable part of this project.",
        branch: "feat/explain",
        prompt: "Write app/explain.py: for a text, return the label, its probability, and the 5 words that pushed most towards each class, using the logistic regression's coefficients times the TF-IDF values. Then in notebooks/04-outside.ipynb, score 20 recent headlines I collect myself from different sources (10 real, 10 that fact-checkers rated false) and compare with the test score. Add an “unsure” result when the probability is between 0.4 and 0.6.",
        steps: [venv],
        understand: ["Explain one prediction word by word.", "Why does the model do worse on your 20 outside headlines?", "When should it say unsure?"],
        check: [{ text: "explain() on any headline returns a label, a probability and words for each side that make sense to you." }],
        commit: "Explain predictions and test on outside headlines",
      },
      saveAndServeTask({ endpoint: "POST /predict", input: "a headline or article text", output: "the label (real, fake or unsure), the probability and the top words each way" }),
    ],
    done: ["Every prediction explains itself", "An honest outside-data test", "POST /predict works, with tests", mergedLine],
  },
  shipWeek("Fake news classifier", streamlitTask({ what: "a text area for a headline or article, a Check button, and the result: the label as a coloured badge, the probability as a bar, and the words that pushed each way as two short lists.", screens: ["app"] }), newsDone),
]

export const aiMlBuilds: Record<string, ProjectBuild> = {
  "resume-screener": resumeScreener,
  "document-qa": documentQa,
  "fake-news-classifier": fakeNews,
}

/* ------------------------------------------------------------------ */
/* Screens                                                             */
/* ------------------------------------------------------------------ */

const term = (title: string, lines: { text: string; tone?: "cmd" | "ok" | "muted" | "warn" }[]): ProjectScreen["mock"] => ({ frame: "terminal", title, blocks: [{ kind: "terminal", lines }] })

export const aiMlScreens: Record<string, ProjectScreen[]> = {
  "resume-screener": [
    {
      id: "eda",
      name: "EDA notebook",
      purpose: "Know the data before you model it: categories, lengths, common words, duplicates.",
      shows: ["Resumes per category", "Text length", "A note under every chart"],
      week: 1,
      mock: { frame: "browser", title: "01-eda.ipynb", url: "localhost:8888/lab", blocks: [{ kind: "bars", title: "Resumes per category", values: [84, 70, 55, 48, 44, 40, 33], labels: ["Java", "Testing", "DevOps", "Python", "Web", "HR", "DS"] }, { kind: "stat", label: "Duplicates removed", value: "796", caption: "of 962 rows were exact duplicates — check before you train" }] },
    },
    {
      id: "models",
      name: "Model comparison",
      purpose: "Three classifiers, compared fairly, and the winner's mistakes.",
      shows: ["Mean macro F1 and spread across 5 folds", "Training time", "A confusion matrix for the best"],
      week: 2,
      mock: { frame: "browser", title: "03-models.ipynb", url: "localhost:8888/lab", blocks: [{ kind: "table", columns: ["Model", "Macro F1", "± std", "Train time"], rows: [["Logistic regression", "0.91", "0.02", "1.8 s"], ["Linear SVM", "0.93", "0.01", "0.9 s"], ["Naive Bayes", "0.84", "0.03", "0.2 s"]] }] },
    },
    {
      id: "api",
      name: "The API",
      purpose: "Any app can score a resume: send text, get a score and the reasons.",
      shows: ["POST /score", "Score, category, matched and missing skills"],
      calls: ["POST /score"],
      week: 3,
      mock: term("localhost:8000/docs", [
        { text: 'POST /score  {"job_description":"Data Scientist: Python, SQL, ML…","resume_text":"…"}', tone: "cmd" },
        { text: '200 OK  {"score":82,"category":"Data Science",', tone: "ok" },
        { text: '         "matched":["python","sql","machine learning"],"missing":["spark"]}' },
      ]),
    },
    {
      id: "app",
      name: "Rank resumes",
      purpose: "The recruiter's view: paste a job, upload resumes, see them ranked with reasons.",
      shows: ["A job description box and a resume uploader", "A ranked table with score and category", "Each row opens its explanation"],
      week: 4,
      mock: { frame: "browser", title: "Resume screener", url: "resume-screener.streamlit.app", blocks: [{ kind: "form", title: "Job description", fields: ["Paste the job description", "Upload resumes (.txt, .pdf)"], button: "Rank resumes" }, { kind: "table", columns: ["Resume", "Score", "Category", "Matched"], rows: [["asha.txt", "82", "Data Science", "python, sql, ml"], ["ravi.txt", "64", "Data Science", "python, excel"], ["neha.txt", "31", "HR", "excel"]] }] },
    },
  ],
  "document-qa": [
    {
      id: "eval",
      name: "Evaluation set and scores",
      purpose: "Your measuring stick: test questions, and how often the right page comes back.",
      shows: ["15–20 questions with expected answers and pages", "Hit rate at 3 for three chunk sizes"],
      week: 2,
      mock: { frame: "browser", title: "02-retrieval.ipynb", url: "localhost:8888/lab", blocks: [{ kind: "table", columns: ["Chunk size", "Hit rate @3", "Chunks"], rows: [["400", "0.71", "1,284"], ["800", "0.88", "642"], ["1200", "0.82", "430"]] }] },
    },
    {
      id: "chat",
      name: "Ask your documents",
      purpose: "Ask in plain English; get an answer with the pages it came from — or an honest “I don't know”.",
      shows: ["A chat box", "Answers with page citations", "“I don't know” for questions outside the documents"],
      calls: ["POST /ask"],
      week: 3,
      mock: { frame: "browser", title: "Ask the docs", url: "ask-docs.streamlit.app", blocks: [{ kind: "chat", messages: [{ from: "user", text: "What is the leave policy for interns?" }, { from: "bot", text: "Interns get 1.5 days of paid leave per month, which can't be carried over [p. 14]." }, { from: "user", text: "What's the CEO's salary?" }, { from: "bot", text: "I don't know — the documents don't say." }] }] },
    },
    {
      id: "api",
      name: "The API",
      purpose: "The same answers, for any app: a question in, an answer and citations out.",
      shows: ["POST /ask", "Answer and cited pages as JSON"],
      calls: ["POST /ask"],
      week: 3,
      mock: term("localhost:8000/docs", [
        { text: 'POST /ask  {"question":"What is the leave policy for interns?"}', tone: "cmd" },
        { text: '200 OK  {"answer":"Interns get 1.5 days of paid leave per month… [p. 14]","pages":[14]}', tone: "ok" },
      ]),
    },
  ],
  "fake-news-classifier": [
    {
      id: "eda",
      name: "EDA notebook",
      purpose: "Find the traps before training: balance, lengths, duplicates — and giveaway words.",
      shows: ["Label balance", "Duplicates", "Leakage clues like “(Reuters)”"],
      week: 1,
      mock: { frame: "browser", title: "01-eda.ipynb", url: "localhost:8888/lab", blocks: [{ kind: "kpis", items: [{ label: "Fake", value: "23,481" }, { label: "Real", value: "21,417" }, { label: "Duplicate titles", value: "6,252" }] }, { kind: "stat", label: "“(Reuters)” appears in", value: "99% of real", caption: "and 0% of fake articles — a leak to remove" }] },
    },
    {
      id: "models",
      name: "Model comparison",
      purpose: "Three models on a leak-free split, compared on the metric you chose.",
      shows: ["Precision, recall and F1 per model", "A confusion matrix for the winner"],
      week: 2,
      mock: { frame: "browser", title: "03-models.ipynb", url: "localhost:8888/lab", blocks: [{ kind: "table", columns: ["Model", "Precision", "Recall", "F1"], rows: [["Logistic regression", "0.94", "0.92", "0.93"], ["Naive Bayes", "0.90", "0.93", "0.91"], ["Linear SVM", "0.95", "0.93", "0.94"]] }] },
    },
    {
      id: "api",
      name: "The API",
      purpose: "Send text, get a label, a probability and the words behind it.",
      shows: ["POST /predict", "Label, probability, top words each way"],
      calls: ["POST /predict"],
      week: 3,
      mock: term("localhost:8000/docs", [
        { text: 'POST /predict  {"text":"Scientists confirm chocolate cures all diseases"}', tone: "cmd" },
        { text: '200 OK  {"label":"fake","probability":0.91,', tone: "ok" },
        { text: '         "towards_fake":["cures","shocking","all"],"towards_real":["scientists"]}' },
      ]),
    },
    {
      id: "app",
      name: "Check a headline",
      purpose: "A reader pastes a headline and gets a label they can understand.",
      shows: ["A text box and Check button", "The label and confidence", "The words that pushed each way"],
      week: 4,
      mock: { frame: "browser", title: "Headline check", url: "headline-check.streamlit.app", blocks: [{ kind: "form", title: "Paste a headline or article", fields: ["Headline"], button: "Check" }, { kind: "stat", label: "Likely fake", value: "91%", caption: "Pushed towards fake: cures, shocking, all" }] },
    },
  ],
}
