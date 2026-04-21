import type { SiteLocale } from "@/lib/site";

export type ContactFaqItem = {
  question: string;
  answer: string;
  schemaQuestion?: string;
  schemaAnswer?: string;
};

export const contactFaqItems: Record<SiteLocale, ContactFaqItem[]> = {
  bg: [
    {
      question: "Къде е тоалетната?",
      answer:
        "Не търсете обикновена врата. След китарата вляво потърсете старите ски - плъзнете ги настрани.",
      schemaQuestion: "Къде е тоалетната в The Friendly Bear?",
      schemaAnswer:
        "Не търсете обикновена врата. След китарата вляво потърсете старите ски - плъзнете ги настрани."
    },
    {
      question: "Приемате ли кредитни карти?",
      answer: "Да, приемаме всички основни карти (Visa, Mastercard, Revolut), както и плащане в брой."
    },
    {
      question: "Може ли да дойдем с куче?",
      answer: "Разбира се. Приветстваме възпитани кучета както в градината, така и вътре.",
      schemaQuestion: "The Friendly Bear София подходящ ли е за кучета?",
      schemaAnswer: "Да, The Friendly Bear е pet-friendly ресторант както в градината, така и вътре."
    },
    {
      question: "Къде може да се паркира?",
      answer:
        "Намираме се в Зелена зона. Използвайте приложението Urbo или SMS на 1303. В неделя е безплатно."
    },
    {
      question: "Екипът говори ли чужди езици?",
      answer: "Да, персоналът ни говори английски, а менюто е налично и на двата езика."
    }
  ],
  en: [
    {
      question: "Where is the bathroom?",
      answer:
        "Don't look for a regular door. Follow the guitar to the left and look for the vintage skis - they slide sideways to reveal the way.",
      schemaQuestion: "Where is the bathroom at The Friendly Bear?",
      schemaAnswer:
        "Don't look for a regular door. Follow the guitar to the left and look for the vintage skis - they slide sideways to reveal the way."
    },
    {
      question: "Do you accept credit cards?",
      answer: "Yes, we accept all major cards (Visa, Mastercard, Revolut) and cash (BGN)."
    },
    {
      question: "Is the restaurant pet-friendly?",
      answer: "Absolutely. Well-behaved dogs are welcome in both the garden and the cabin.",
      schemaQuestion: "Is the restaurant pet friendly?",
      schemaAnswer: "Yes, we are 100% pet friendly in our garden and indoor cabin."
    },
    {
      question: "Where can I park?",
      answer: "We are in the Green Zone. Use the Urbo app or SMS to 1303. Parking is free on Sundays."
    },
    {
      question: "Do you speak English?",
      answer: "Yes, our staff is fluent and the menu is fully available in English."
    }
  ]
};
