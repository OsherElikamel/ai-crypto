export const NONE = "__NONE__";

export const QUIZ_QUESTIONS = [
  {
    id: "coins",
    type: "multi",
    question: "Which coins interest you most?",
    options: ["BTC", "ETH", "SOL", "BNB", "XRP", "DOGE", "Other", NONE] 
  },
  {
    id: "investorType",
    type: "single",
    question: "What kind of investor are you?",
    options: ["HODL", "DABBLER", "TRADER", "NFT_DEFI", NONE]
  },
  {
    id: "risk",
    type: "single",
    question: "How much risk are you comfortable with?",
    options: ["LOW", "MEDIUM", "HIGH", NONE]
  },
  {
    id: "contentTypes",
    type: "multi",
    question: "What do you want to see more of?",
    options: ["News", "Prices", "On-chain", "Education", "Memes", NONE]
  },
  {
    id: "fiat",
    type: "multi",
    question: "Preferred fiat currencies?",
    options: ["USD", "EUR", "ILS", NONE]
  },
  {
    id: "depth",
    type: "single",
    question: "How deep should the content be?",
    options: ["SHORT", "MEDIUM", "DEEP", NONE]
  },
  {
    id: "alerts",
    type: "boolean",
    question: "Do you want alerts?"
  }
];
