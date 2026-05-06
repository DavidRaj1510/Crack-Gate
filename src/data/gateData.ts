export type Priority = "High" | "Medium" | "Low";

export interface Subject {
  name: string;
  short: string;
  avgMarks: number;
  range: string;
  weightagePct: number;
  difficulty: "Easy" | "Moderate" | "Hard";
  highTopics: string[];
  lowTopics: string[];
  strategy: string;
}

// Weightage based on GATE CS papers from 2010–2024 (avg of past 15 years, 100 marks total)
export const subjects: Subject[] = [
  {
    name: "Engineering Mathematics",
    short: "Math",
    avgMarks: 13,
    range: "11–15",
    weightagePct: 13,
    difficulty: "Moderate",
    highTopics: [
      "Probability (conditional, Bayes, distributions)",
      "Linear Algebra (eigenvalues, rank, systems)",
      "Calculus (limits, maxima/minima, integration)",
      "Combinatorics & Counting",
      "Graph Theory basics (degree, trees, connectivity)",
    ],
    lowTopics: [
      "Set Theory & Relations (basic)",
      "Propositional & First-order Logic",
      "Group Theory (rare, 0–1 marks)",
    ],
    strategy: "Daily 45-min practice. Highest ROI subject — appears every year.",
  },
  {
    name: "Discrete Mathematics",
    short: "Discrete",
    avgMarks: 8,
    range: "6–10",
    weightagePct: 8,
    difficulty: "Moderate",
    highTopics: [
      "Mathematical Logic & Predicate Logic",
      "Sets, Relations, Functions",
      "Graph Theory (Euler, Hamiltonian, coloring)",
      "Combinatorics (PIE, recurrences, generating functions)",
    ],
    lowTopics: ["Lattices & Posets", "Boolean Algebra (overlaps with DL)"],
    strategy: "Often clubbed with Engg Math. Focus on graph theory & recurrences.",
  },
  {
    name: "Algorithms",
    short: "Algo",
    avgMarks: 9,
    range: "7–11",
    weightagePct: 9,
    difficulty: "Hard",
    highTopics: [
      "Asymptotic Analysis & Recurrences (Master theorem)",
      "Greedy (Huffman, MST — Prim/Kruskal)",
      "Dynamic Programming (LCS, MCM, Knapsack)",
      "Divide & Conquer (sorting, searching)",
      "Graph algorithms (BFS, DFS, Dijkstra, Bellman-Ford, topological sort)",
    ],
    lowTopics: ["P, NP, NP-Complete (1–2 marks max)", "String matching algorithms"],
    strategy: "Solve previous-year + standard problems. Time-complexity questions are guaranteed.",
  },
  {
    name: "Data Structures & C Programming",
    short: "DS+C",
    avgMarks: 9,
    range: "7–11",
    weightagePct: 9,
    difficulty: "Moderate",
    highTopics: [
      "Arrays, Linked Lists, Stacks, Queues",
      "Trees (BST, AVL, Heap, B/B+ trees basics)",
      "Hashing (collision, chaining, probing)",
      "C — pointers, arrays of pointers, recursion",
      "Output prediction & pointer arithmetic",
    ],
    lowTopics: ["Graph representation", "Tries (rare)"],
    strategy: "C output questions = free marks. Master pointers cold.",
  },
  {
    name: "Operating Systems",
    short: "OS",
    avgMarks: 9,
    range: "7–11",
    weightagePct: 9,
    difficulty: "Moderate",
    highTopics: [
      "Process Scheduling (FCFS, SJF, RR, MLFQ — numericals)",
      "Synchronization (semaphores, mutex, classical problems)",
      "Deadlock (Banker's, RAG)",
      "Memory Management (paging, segmentation, TLB)",
      "Page Replacement (FIFO, LRU, Optimal)",
    ],
    lowTopics: ["File systems & Disk scheduling (1–2 marks)", "I/O systems"],
    strategy: "Numerical-heavy. Practice 100+ scheduling & paging problems.",
  },
  {
    name: "DBMS",
    short: "DBMS",
    avgMarks: 8,
    range: "6–10",
    weightagePct: 8,
    difficulty: "Moderate",
    highTopics: [
      "Relational Algebra & SQL (joins, nested queries, aggregates)",
      "Normalization (1NF–BCNF, decomposition)",
      "Functional Dependencies & Closure",
      "Transactions (ACID, schedules, serializability)",
      "Indexing (B+ trees, hashing)",
    ],
    lowTopics: ["ER model (basic)", "Concurrency control protocols (advanced)"],
    strategy: "SQL + Normalization + Transactions = 70% of DBMS marks.",
  },
  {
    name: "Computer Networks",
    short: "CN",
    avgMarks: 8,
    range: "6–10",
    weightagePct: 8,
    difficulty: "Moderate",
    highTopics: [
      "TCP/IP (handshake, flow control, congestion)",
      "IP addressing & Subnetting (CIDR, VLSM)",
      "Routing (Distance vector, Link state, OSPF)",
      "Sliding window protocols (Go-Back-N, Selective Repeat)",
      "Ethernet, CSMA/CD, error detection (CRC, Hamming)",
    ],
    lowTopics: ["Application layer protocols (HTTP, DNS — conceptual)", "Network security basics"],
    strategy: "Subnetting + TCP numericals are repeating. Master them.",
  },
  {
    name: "Theory of Computation",
    short: "TOC",
    avgMarks: 7,
    range: "5–9",
    weightagePct: 7,
    difficulty: "Hard",
    highTopics: [
      "Regular Languages, DFA/NFA, RE",
      "Pumping Lemma (regular & CFL)",
      "Context-Free Grammars & PDA",
      "Decidability & Undecidability",
      "Closure Properties",
    ],
    lowTopics: ["Turing Machine variants (1 mark)", "Chomsky hierarchy details"],
    strategy: "Conceptual + tricky. Don't skip — questions are formula-light.",
  },
  {
    name: "Compiler Design",
    short: "CD",
    avgMarks: 5,
    range: "3–7",
    weightagePct: 5,
    difficulty: "Moderate",
    highTopics: [
      "Lexical Analysis & Parsing (LL(1), LR, SLR, LALR)",
      "Syntax-Directed Translation",
      "Intermediate Code Generation",
      "Code Optimization (basic blocks, DAG)",
    ],
    lowTopics: ["Runtime environments", "Symbol table management"],
    strategy: "Parsing tables = guaranteed question. Limited scope, high return.",
  },
  {
    name: "Digital Logic",
    short: "DL",
    avgMarks: 6,
    range: "4–8",
    weightagePct: 6,
    difficulty: "Easy",
    highTopics: [
      "Number Systems & Codes (2's complement, IEEE 754)",
      "Boolean Algebra & K-maps",
      "Combinational Circuits (MUX, decoder, adders)",
      "Sequential Circuits (flip-flops, counters)",
    ],
    lowTopics: ["Minimization techniques (Quine-McCluskey)", "PLA/PAL"],
    strategy: "Easiest scoring subject. 2 weeks of focused study = full marks.",
  },
  {
    name: "Computer Organization & Architecture",
    short: "COA",
    avgMarks: 8,
    range: "6–10",
    weightagePct: 8,
    difficulty: "Moderate",
    highTopics: [
      "Pipelining (hazards, speedup, throughput)",
      "Cache Memory (mapping, hit/miss, replacement)",
      "Addressing Modes & Instruction formats",
      "Memory Hierarchy (virtual memory, TLB)",
      "I/O (interrupts, DMA)",
    ],
    lowTopics: ["Microprogrammed control (rare)", "Floating-point arithmetic edge cases"],
    strategy: "Pipelining + Cache = 60% of COA marks every year.",
  },
  {
    name: "Aptitude & English (General Aptitude)",
    short: "GA",
    avgMarks: 15,
    range: "15",
    weightagePct: 15,
    difficulty: "Easy",
    highTopics: [
      "Quantitative Aptitude (ratios, percentages, P&C, probability)",
      "Logical Reasoning (puzzles, sequences, data interpretation)",
      "Verbal Ability (grammar, vocabulary, RC)",
      "Numerical Reasoning (clocks, calendars, mensuration)",
    ],
    lowTopics: ["Visual reasoning (occasional)"],
    strategy: "FIXED 15 marks every year. 1 month of practice = 13–15/15. Don't ignore!",
  },
];

export const monthlyPlan = [
  { phase: "Phase 1 — Foundation", months: "May 2026 – Aug 2026", duration: "4 months", focus: "Engg Math, Discrete Math, Digital Logic, C Programming, Data Structures", goal: "Build core. Cover NPTEL/standard textbooks. Daily 5–6 hrs.", color: "accent", subjectShorts: ["Math", "Discrete", "DL", "DS+C"] },
  { phase: "Phase 2 — Core CS", months: "Sep 2026 – Nov 2026", duration: "3 months", focus: "Algorithms, OS, DBMS, COA, TOC", goal: "High-weightage subjects. Solve 30+ PYQs per subject. Daily 6–7 hrs.", color: "secondary", subjectShorts: ["Algo", "OS", "DBMS", "COA", "TOC"] },
  { phase: "Phase 3 — Closing", months: "Dec 2026", duration: "1 month", focus: "Computer Networks, Compiler Design, General Aptitude", goal: "Finish syllabus. Start full-length mocks weekly.", color: "primary", subjectShorts: ["CN", "CD", "GA"] },
  { phase: "Phase 4 — Revision", months: "Jan 2027", duration: "3 weeks", focus: "Full revision + 15 GATE PYQ papers + 10 mock tests", goal: "Aim 75+ in mocks. Identify & patch weak areas.", color: "gold", subjectShorts: [] },
  { phase: "Phase 5 — Peak", months: "Last 10 days", duration: "10 days", focus: "Formula sheets, short notes, mental rest", goal: "No new topics. Light revision. Sleep well.", color: "success", subjectShorts: [] },
];

export const resources = [
  { subject: "Engg Math", books: "B.S. Grewal, Made Easy notes", lectures: "Ravindrababu Ravula, NPTEL (IITM)" },
  { subject: "Algorithms", books: "CLRS (selective), Narasimha Karumanchi", lectures: "Abdul Bari (YouTube), Gate Smashers" },
  { subject: "OS", books: "Galvin (Operating System Concepts)", lectures: "Gate Smashers, Knowledge Gate" },
  { subject: "DBMS", books: "Korth, Navathe (selective chapters)", lectures: "Gate Smashers, Jenny's Lectures" },
  { subject: "CN", books: "Forouzan, Tanenbaum (selective)", lectures: "Ravindrababu Ravula, Gate Smashers" },
  { subject: "TOC", books: "Peter Linz, Ullman", lectures: "Neso Academy, Ravindrababu Ravula" },
  { subject: "COA", books: "Carl Hamacher, Morris Mano", lectures: "Ravindrababu Ravula, Knowledge Gate" },
  { subject: "Compiler Design", books: "Aho (Dragon Book — selective)", lectures: "Gate Smashers, University Academy" },
  { subject: "Digital Logic", books: "Morris Mano", lectures: "Neso Academy" },
  { subject: "DS + C", books: "Karumanchi, K&R (C)", lectures: "Mycodeschool, Gate Smashers" },
  { subject: "Aptitude", books: "R.S. Aggarwal, Arun Sharma", lectures: "Made Easy aptitude playlist" },
];

export const tips = [
  { title: "Solve 15-year PYQs twice", desc: "Roughly 40–50% of GATE questions repeat patterns from previous years. Two full passes is non-negotiable." },
  { title: "Mock tests from Aug 2026", desc: "Start subject-wise mocks early; full-length from Dec. Aim 25+ full mocks before exam." },
  { title: "Maintain a formula notebook", desc: "Single A5 notebook for all subjects. Revise it daily in last 30 days." },
  { title: "Don't skip GA", desc: "15 fixed marks. Easiest path to push your rank under 1000." },
  { title: "Negative marking discipline", desc: "1/3 negative. Skip if confidence < 60%. Attempt strategy decides rank, not knowledge." },
  { title: "Health is rank", desc: "7 hrs sleep, 30 min walk, no all-nighters. Burnout in Dec ruins Feb." },
];