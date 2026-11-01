import type { TrackDocs } from "@/data/docs/types"

export const aiMlDocs: TrackDocs = {
  track: "ai-ml",
  projects: [
    {
      slug: "resume-screener",
      pitch: "Build a tool that scores resumes against a job description and explains each match — the kind of screening real recruiters do at scale.",
      users: [{ who: "Recruiter", need: "Shortlist the best resumes for a role quickly and see why each scored as it did." }],
      mustHave: [
        "Load a public resume dataset (e.g. a Kaggle resume dataset) and clean the text.",
        "Baseline: TF-IDF + cosine similarity between a job description and each resume.",
        "A classifier that predicts a resume's job category, evaluated with precision, recall and F1.",
        "Explain matches: top overlapping skills and keywords.",
        "FastAPI endpoint: send a job description + resume text, get a score and explanation.",
        "Streamlit app: paste a job description, upload resumes, see a ranked list.",
      ],
      niceToHave: ["Compare against sentence embeddings or an LLM for scoring.", "PDF upload with text extraction.", "Bias check across categories."],
      outOfScope: ["Storing real candidates' personal data.", "Automated hiring decisions."],
      flows: [
        { name: "Rank resumes", steps: ["Recruiter pastes a job description.", "Uploads several resumes.", "Sees them ranked with a score and matched skills."] },
      ],
      overview: "Experiment in notebooks, save the best pipeline with joblib, then load that one file in both FastAPI and Streamlit.",
      data: [
        { name: "Resume dataset", fields: ["resume_text", "category (e.g. Data Science, HR, Java Developer)"] },
        { name: "Job description", fields: ["title", "description_text (entered by the user)"] },
      ],
      interface: [
        { label: "Input", detail: "Job description text + one or more resume texts." },
        { label: "Output", detail: "Match score 0–100, predicted category, top matched skills." },
        { label: "POST /score", detail: "FastAPI endpoint returning the output as JSON." },
      ],
      weeks: [
        ["Define success: which metric matters and why.", "Explore and clean the dataset in Jupyter.", "Write the pipeline plan."],
        ["Baseline TF-IDF similarity.", "Train and cross-validate 2–3 classifiers.", "Comparison table of results."],
        ["Add embeddings or an LLM comparison.", "Explanation of matched skills.", "Save the model; build the FastAPI endpoint."],
        ["Streamlit app; deploy it (e.g. Streamlit Community Cloud).", "README with metrics and limitations; demo.", "Final review."],
      ],
      doneWhen: [
        "The README reports precision, recall and F1 on a held-out test set.",
        "Each score comes with a human-readable explanation.",
        "The Streamlit app is live.",
        "Limitations and possible bias are written down honestly.",
      ],
    },
    {
      slug: "document-qa",
      pitch: "Build a document Q&A bot: upload PDFs, ask questions in plain English, and get answers that cite the exact passages they came from (RAG).",
      users: [{ who: "Student or analyst", need: "Get answers from long documents without reading them end to end." }],
      mustHave: [
        "Upload PDFs; extract and split text into chunks.",
        "Create embeddings and store them in a vector index (e.g. FAISS or Chroma).",
        "Retrieve the most relevant chunks for a question.",
        "Generate an answer with an LLM API using only those chunks, with citations.",
        "Say “I don't know” when the answer isn't in the documents.",
        "Evaluation: 15–20 test questions with expected answers, scored for correctness.",
      ],
      niceToHave: ["Chat history.", "Compare two chunk sizes.", "Highlight the cited passage."],
      outOfScope: ["Training your own LLM.", "Very large document collections."],
      flows: [
        { name: "Ask a question", steps: ["User uploads a PDF.", "Asks a question.", "Gets an answer with page citations."] },
      ],
      overview: "RAG = retrieve then generate. The quality depends more on chunking and retrieval than on the LLM, so you'll measure retrieval separately.",
      data: [
        { name: "Chunk", fields: ["id", "document", "page", "text", "embedding"] },
        { name: "Eval question", fields: ["question", "expected_answer", "source_page"] },
      ],
      interface: [
        { label: "Input", detail: "PDF files + a question." },
        { label: "Output", detail: "Answer text + list of cited pages/passages." },
        { label: "POST /ask", detail: "FastAPI endpoint." },
      ],
      weeks: [
        ["Pick 2–3 documents and write your evaluation questions first.", "Explore text extraction in Jupyter.", "Plan the pipeline."],
        ["Chunking + embeddings + vector index.", "Measure retrieval: is the right chunk in the top 3?", "Tune chunk size."],
        ["Answer generation with citations via an LLM API.", "“I don't know” handling.", "FastAPI endpoint."],
        ["Streamlit chat UI; deploy.", "README with evaluation results and costs; demo.", "Final review."],
      ],
      doneWhen: [
        "Answers cite their sources.",
        "Questions outside the documents get “I don't know”.",
        "The README reports your evaluation score.",
        "API keys are kept out of the repository.",
      ],
    },
    {
      slug: "fake-news-classifier",
      pitch: "Build a classifier that labels news headlines and articles as likely real or fake, and be honest about how well it works.",
      users: [{ who: "Reader", need: "A quick signal on whether a headline is trustworthy." }],
      mustHave: [
        "Use a public labelled fake-news dataset; clean and split it properly.",
        "Baseline: TF-IDF + logistic regression.",
        "Compare at least two more models (e.g. Naive Bayes, a small PyTorch model or a fine-tuned transformer).",
        "Report precision, recall, F1 and a confusion matrix; choose the metric that matters.",
        "Show the words that pushed a prediction each way.",
        "FastAPI endpoint and a Streamlit demo.",
      ],
      niceToHave: ["Test on headlines from a different source than training.", "Confidence threshold with “unsure”."],
      outOfScope: ["Fact-checking claims against the web."],
      flows: [{ name: "Check a headline", steps: ["User pastes a headline or article.", "Sees a label, a confidence and the most influential words."] }],
      overview: "The trap here is leakage — make sure the same article (or source) never appears in both training and test data.",
      data: [{ name: "News dataset", fields: ["title", "text", "subject/source", "label (real | fake)"] }],
      interface: [
        { label: "Input", detail: "Headline or article text." },
        { label: "Output", detail: "Label, probability, top words for and against." },
        { label: "POST /predict", detail: "FastAPI endpoint." },
      ],
      weeks: [
        ["Choose your primary metric and explain why.", "EDA: class balance, text length, sources.", "Pipeline plan and train/test split."],
        ["Baseline model.", "Two more models with cross-validation.", "Confusion matrices and comparison."],
        ["Explanations of predictions.", "Check generalisation on unseen sources.", "FastAPI endpoint."],
        ["Streamlit demo; deploy.", "README with metrics and limitations; demo.", "Final review."],
      ],
      doneWhen: [
        "No leakage between training and test data.",
        "The README explains which metric you optimised and why.",
        "Predictions come with explanations.",
        "Limitations are clearly stated.",
      ],
    },
  ],
}
