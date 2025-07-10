export interface FamousPerson {
  id: string;
  name: string;
  profession: string;
  birthYear: number;
  achievements: string[];
  background: string;
  imageUrl?: string;
}

// Fake data for famous people
const fakeFamousPeople: FamousPerson[] = [
  {
    id: "1",
    name: "Albert Einstein",
    profession: "Physicist",
    birthYear: 1879,
    achievements: [
      "Nobel Prize in Physics (1921)",
      "Theory of Relativity",
      "E = mc² equation",
    ],
    background:
      "Revolutionary physicist who developed the theory of relativity, one of the two pillars of modern physics.",
  },
  {
    id: "2",
    name: "Marie Curie",
    profession: "Physicist & Chemist",
    birthYear: 1867,
    achievements: [
      "Nobel Prize in Physics (1903)",
      "Nobel Prize in Chemistry (1911)",
      "Discovery of Radium and Polonium",
    ],
    background:
      "Pioneering researcher on radioactivity and the first person to win Nobel Prizes in two different scientific fields.",
  },
  {
    id: "3",
    name: "Leonardo da Vinci",
    profession: "Artist & Inventor",
    birthYear: 1452,
    achievements: ["Mona Lisa", "The Last Supper", "Flying Machine Designs"],
    background:
      "Renaissance polymath whose areas of interest included invention, drawing, painting, sculpture, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, paleontology, and cartography.",
  },
  {
    id: "4",
    name: "William Shakespeare",
    profession: "Playwright & Poet",
    birthYear: 1564,
    achievements: ["Romeo and Juliet", "Hamlet", "Macbeth"],
    background:
      "English playwright, poet, and actor, widely regarded as the greatest writer in the English language and the world's greatest dramatist.",
  },
  {
    id: "5",
    name: "Mozart",
    profession: "Composer",
    birthYear: 1756,
    achievements: ["Symphony No. 40", "The Magic Flute", "Requiem Mass"],
    background:
      "Prolific and influential composer of the Classical period who composed over 600 works.",
  },
  {
    id: "6",
    name: "Vincent van Gogh",
    profession: "Artist",
    birthYear: 1853,
    achievements: ["The Starry Night", "Sunflowers", "Self-Portraits"],
    background:
      "Post-impressionist painter who posthumously became one of the most famous and influential figures in Western art history.",
  },
  {
    id: "7",
    name: "Isaac Newton",
    profession: "Physicist & Mathematician",
    birthYear: 1643,
    achievements: ["Laws of Motion", "Universal Gravitation", "Calculus"],
    background:
      "English mathematician, physicist, astronomer, alchemist, theologian, and author who was described in his time as a natural philosopher.",
  },
  {
    id: "8",
    name: "Frida Kahlo",
    profession: "Artist",
    birthYear: 1907,
    achievements: [
      "Self-Portrait with Thorn Necklace",
      "The Two Fridas",
      "Mexican Folk Art Revival",
    ],
    background:
      "Mexican painter known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.",
  },
  {
    id: "9",
    name: "Nikola Tesla",
    profession: "Inventor & Engineer",
    birthYear: 1856,
    achievements: ["Alternating Current", "Tesla Coil", "Wireless Electricity"],
    background:
      "Serbian-American inventor, electrical engineer, mechanical engineer, and futurist best known for his contributions to the design of the modern alternating current electricity supply system.",
  },
  {
    id: "10",
    name: "Jane Austen",
    profession: "Novelist",
    birthYear: 1775,
    achievements: ["Pride and Prejudice", "Emma", "Sense and Sensibility"],
    background:
      "English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century.",
  },
];

// Generate a hash from date to consistently return same people for same date
function getHashFromDate(date: Date): number {
  const dateString = `${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get top 3 famous people for a given birthdate
export function getFamousPeopleForDate(birthdate: Date): FamousPerson[] {
  const hash = getHashFromDate(birthdate);
  const shuffled = [...fakeFamousPeople].sort(() => 0.5 - Math.random());

  // Use hash to seed a pseudo-random selection
  const seed = hash % 1000;
  const startIndex = seed % (shuffled.length - 2);

  return shuffled.slice(startIndex, startIndex + 3);
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
