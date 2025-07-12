export interface WikimediaPerson {
  id: string;
  name: string;
  profession: string;
  birthYear: number;
  achievements: string[];
  background: string;
  imageUrl?: string;
  wikipediaUrl?: string;
}

// Main function to get famous people for a specific date
export async function getFamousPeopleForDate(
  birthdate: Date
): Promise<WikimediaPerson[]> {
  try {
    const month = birthdate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
    const day = birthdate.getDate();
    const year = birthdate.getFullYear();
    console.log("🔍 Searching for famous people born on:", month, day, year);

    // Call our API route instead of Wikimedia directly
    const apiUrl = `/api/famous-people?month=${month}&day=${day}&year=${year}`;
    console.log("📡 Calling API:", apiUrl);

    const response = await fetch(apiUrl);
    console.log("📥 Response status:", response.status);

    if (!response.ok) {
      console.error(
        "❌ API request failed:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch famous people");
    }

    const people: WikimediaPerson[] = await response.json();
    console.log("✅ Received people:", people.length, "results");
    console.log("👥 People data:", people);

    if (people.length === 0) {
      console.log("⚠️ No results found");
      // Fallback to fake data if no results found
      return [];
    }

    return people;
  } catch (error) {
    console.error("💥 Error fetching famous people:", error);
    return getFallbackData(birthdate);
  }
}

// Fallback to fake data if API fails
function getFallbackData(birthdate: Date): WikimediaPerson[] {
  const fallbackPeople: WikimediaPerson[] = [
    {
      id: "fallback-1",
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
      id: "fallback-2",
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
      id: "fallback-3",
      name: "Leonardo da Vinci",
      profession: "Artist & Inventor",
      birthYear: 1452,
      achievements: ["Mona Lisa", "The Last Supper", "Flying Machine Designs"],
      background:
        "Renaissance polymath whose areas of interest included invention, drawing, painting, sculpture, architecture, science, music, mathematics, engineering, literature, anatomy, geology, astronomy, botany, paleontology, and cartography.",
    },
  ];

  // Use date hash to consistently return same people for same date
  const hash = getHashFromDate(birthdate);
  const startIndex = hash % fallbackPeople.length;

  return fallbackPeople.slice(startIndex, startIndex + 3);
}

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

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
