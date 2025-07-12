import { NextRequest, NextResponse } from "next/server";

interface WikimediaPerson {
  id: string;
  name: string;
  profession: string;
  birthYear: number;
  achievements: string[];
  background: string;
  imageUrl?: string;
  wikipediaUrl?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month");
  const day = searchParams.get("day");
  const year = searchParams.get("year");

  console.log("🚀 API route called with params:", { month, day, year });

  if (!month || !day || !year) {
    console.log("❌ Missing required parameters");
    return NextResponse.json(
      { error: "Month, day and year parameters are required" },
      { status: 400 }
    );
  }

  try {
    console.log("🔍 Starting search for famous people...");

    // Try multiple search strategies
    const results = await tryMultipleSearchStrategies(
      parseInt(month),
      parseInt(day),
      parseInt(year)
    );

    if (results.length === 0) {
      console.log("⚠️ No results found for this date");
      return NextResponse.json([]);
    }

    console.log("🎉 Final result:", results.length, "people found");
    console.log(
      "📝 Final people:",
      results.map((p) => p.name)
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error("💥 Error fetching famous people:", error);
    return NextResponse.json(
      { error: "Failed to fetch famous people" },
      { status: 500 }
    );
  }
}

async function tryMultipleSearchStrategies(
  month: number,
  day: number,
  year: number
): Promise<WikimediaPerson[]> {
  const strategies = [
    () => searchByDateCategory(month, day, year),
    () => searchByBirthQueries(month, day, year),
    () => searchBySpecificPeople(month, day, year),
  ];

  for (const strategy of strategies) {
    try {
      console.log("🔍 Trying search strategy...");
      const results = await strategy();
      if (results.length > 0) {
        console.log("✅ Strategy successful, found", results.length, "people");
        return results;
      }
    } catch (error) {
      console.log("⚠️ Strategy failed:", error);
    }
  }

  return [];
}

async function searchByDateCategory(
  month: number,
  day: number,
  year: number
): Promise<WikimediaPerson[]> {
  // Try to get people from Wikipedia's "Births by month and day" category
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthName = monthNames[month - 1];
  const categoryTitle = `Category:${monthName}_${day}_${year}_births`;

  console.log("🔍 Searching category:", categoryTitle);

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(
        categoryTitle
      )}&format=json&cmlimit=10&cmnamespace=0`
    );

    if (!response.ok) return [];

    const data = await response.json();
    const members = data.query?.categorymembers || [];

    console.log("📊 Found", members.length, "category members");

    // Get details for the first few members
    const peoplePromises = members
      .slice(0, 3)
      .map(async (member: { title: string }) => {
        return await getPersonDetails(member.title);
      });

    const people = await Promise.all(peoplePromises);
    return people.filter((p) => p !== null);
  } catch (error) {
    console.error("❌ Category search failed:", error);
    return [];
  }
}

async function searchByBirthQueries(
  month: number,
  day: number,
  year: number
): Promise<WikimediaPerson[]> {
  const searchQueries = [
    `
SELECT ?person ?personLabel WHERE {
  {
    SELECT ?person WHERE {
      ?person wdt:P31 wd:Q5;
        wdt:P569 ?birthDate.
      FILTER((((MONTH(?birthDate)) = ${month} ) && ((DAY(?birthDate)) = ${day} )) && ((YEAR(?birthDate)) = ${year} ))
    }
    LIMIT 10
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
`,
  ];

  console.log("📝 Search queries:", searchQueries);

  interface SearchResult {
    pageid: number;
    title: string;
    snippet: string;
  }

  const allResults: SearchResult[] = [];

  for (const query of searchQueries) {
    try {
      console.log("🔎 Searching for:", query);

      const searchUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`;
      console.log("🔗 Search URL:", searchUrl);

      const response = await fetch(searchUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!response.ok) {
        console.log("⚠️ Search failed for:", query, "Status:", response.status);
        continue;
      }

      const data = await response.json();
      console.log("📊 Raw API response:", data);

      // Handle the new data structure: {births: [{text: 'Name, Profession', pages: [Array], year: 2007}, ...]}
      if (data.births && Array.isArray(data.births)) {
        console.log("📋 Found", data.births.length, "births");
        let returnCount = 0;

        const peoplePromises = data.births.map(
          async (birth: {
            text: string;
            pages: { title?: string; name?: string; url?: string }[];
            year: number;
          }) => {
            if (returnCount < 3 && birth.year === year) {
              returnCount++;
              return await processBirthData(birth);
            }
            return null;
          }
        );

        const people = await Promise.all(peoplePromises);
        const validPeople = people.filter((person) => person !== null);

        if (validPeople.length > 0) {
          console.log(
            "✅ Successfully processed",
            validPeople.length,
            "people"
          );
          return validPeople;
        }
      }

      console.log("⚠️ No valid birth data found");
      return [];
    } catch (error) {
      console.error(`❌ Error searching for "${query}":`, error);
    }
  }

  // Remove duplicates and return top results
  const uniqueResults = allResults.filter(
    (result, index, self) =>
      index === self.findIndex((r) => r.pageid === result.pageid)
  );

  console.log("🎯 Total unique results:", uniqueResults.length);
  console.log(
    "📋 Unique results:",
    uniqueResults.map((r) => r.title)
  );

  // Get detailed information for top 3 results
  const peoplePromises = uniqueResults.slice(0, 3).map(async (result) => {
    return await getPersonDetails(result.title);
  });

  const people = await Promise.all(peoplePromises);
  return people.filter((person) => person !== null);
}

async function processBirthData(birth: {
  text: string;
  pages: { title?: string; name?: string; url?: string }[];
  year: number;
}): Promise<WikimediaPerson | null> {
  try {
    console.log("🔍 Processing birth data:", birth);

    // Extract name and profession from text
    const text = birth.text || "";
    const year = birth.year || 0;

    // Parse the text to extract name and profession
    const nameMatch = text.match(/^([^,]+)/);
    const professionMatch = text.match(/,\s*([^,]+)$/);

    const name = nameMatch ? nameMatch[1].trim() : "Unknown Person";
    const profession = professionMatch
      ? professionMatch[1].trim()
      : "Notable Person";

    console.log("👤 Extracted:", { name, profession, year });

    // If we have pages, get the first one for details
    if (birth.pages && Array.isArray(birth.pages) && birth.pages.length > 0) {
      const firstPage = birth.pages[0];
      console.log("📄 Using page:", firstPage);

      // Get detailed information from the page
      const personDetails = await getPersonDetailsFromPage(firstPage);
      if (personDetails) {
        return {
          id: personDetails.id || Math.random().toString(),
          name: name,
          profession: profession,
          birthYear: year,
          achievements:
            personDetails.achievements || generateAchievements(profession),
          background:
            personDetails.background ||
            `${name} is a ${profession.toLowerCase()} born in ${year}.`,
          imageUrl: personDetails.imageUrl,
          wikipediaUrl: personDetails.wikipediaUrl,
        };
      }
    }

    // Fallback: create basic person data
    const achievements = generateAchievements(profession);

    return {
      id: Math.random().toString(),
      name: name,
      profession: profession,
      birthYear: year,
      achievements: achievements,
      background: `${name} is a ${profession.toLowerCase()} born in ${year}.`,
      imageUrl: undefined,
      wikipediaUrl: undefined,
    };
  } catch (error) {
    console.error("❌ Error processing birth data:", error);
    return null;
  }
}

async function getPersonDetailsFromPage(page: {
  title?: string;
  name?: string;
  url?: string;
}): Promise<Partial<WikimediaPerson> | null> {
  try {
    // Extract page title or URL from the page object
    const pageTitle = page.title || page.name || page.url;

    if (!pageTitle) {
      console.log("⚠️ No page title found");
      return null;
    }

    console.log("🔍 Getting details from page:", pageTitle);

    // Use the Wikimedia REST API to get page details
    const detailResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        pageTitle
      )}`
    );

    if (!detailResponse.ok) {
      console.log(
        "⚠️ Detail fetch failed for:",
        pageTitle,
        "Status:",
        detailResponse.status
      );
      return null;
    }

    const detailData = await detailResponse.json();
    console.log("✅ Got details for:", pageTitle);

    // Extract achievements
    const achievements = extractAchievements(detailData.extract);

    return {
      id: detailData.pageid?.toString() || Math.random().toString(),
      achievements: achievements,
      background: detailData.extract.substring(0, 200) + "...",
      imageUrl: detailData.thumbnail?.source,
      wikipediaUrl:
        detailData.content_urls?.desktop?.page || detailData.fullurl,
    };
  } catch (error) {
    console.error("❌ Error getting page details:", error);
    return null;
  }
}

function generateAchievements(profession: string): string[] {
  const prof = profession.toLowerCase();

  if (prof.includes("actor") || prof.includes("actress")) {
    return [
      "Film and television performances",
      "Award-winning roles",
      "Notable character portrayals",
    ];
  } else if (prof.includes("musician") || prof.includes("singer")) {
    return [
      "Musical compositions and performances",
      "Chart-topping hits",
      "Award-winning albums",
    ];
  } else if (prof.includes("writer") || prof.includes("author")) {
    return [
      "Literary works and publications",
      "Bestselling books",
      "Award-winning writing",
    ];
  } else if (prof.includes("artist") || prof.includes("painter")) {
    return [
      "Artistic creations and exhibitions",
      "Notable artwork",
      "Gallery exhibitions",
    ];
  } else if (prof.includes("scientist") || prof.includes("researcher")) {
    return [
      "Scientific discoveries and research",
      "Published studies",
      "Innovation contributions",
    ];
  } else if (prof.includes("athlete") || prof.includes("player")) {
    return [
      "Sports achievements",
      "Championship wins",
      "Record-breaking performances",
    ];
  } else if (prof.includes("politician") || prof.includes("leader")) {
    return [
      "Political leadership",
      "Policy achievements",
      "Public service contributions",
    ];
  } else {
    return [
      "Significant contributions to their field",
      "Professional achievements",
      "Industry recognition",
    ];
  }
}

async function searchBySpecificPeople(
  month: number,
  day: number,
  year: number
): Promise<WikimediaPerson[]> {
  // Try to find specific famous people known to be born on this date
  const famousPeopleByDate: { [key: string]: string[] } = {
    "3-14": ["Albert Einstein", "Stephen Curry", "Michael Caine"],
    "7-4": ["Nathaniel Hawthorne", "Calvin Coolidge", "Neil Simon"],
    "12-25": ["Isaac Newton", "Humphrey Bogart", "Annie Lennox"],
    "1-15": ["Martin Luther King Jr.", "Aristotle Onassis", "Maya Angelou"],
    "4-15": ["Leonardo da Vinci", "Emma Watson", "Leonardo DiCaprio"],
    "6-15": ["Helen Hunt", "Neil Patrick Harris", "Courteney Cox"],
    "9-15": ["Agatha Christie", "Tommy Lee Jones", "Prince Harry"],
    "11-15": ["Georgia O'Keeffe", "Meryl Streep", "Shailene Woodley"],
  };

  const dateKey = `${month}-${day}-${year}`;
  const famousPeople = famousPeopleByDate[dateKey] || [];

  console.log("🔍 Searching for specific people:", famousPeople);

  const peoplePromises = famousPeople.map(async (name) => {
    return await getPersonDetails(name);
  });

  const people = await Promise.all(peoplePromises);
  return people.filter((person) => person !== null);
}

async function getPersonDetails(
  title: string
): Promise<WikimediaPerson | null> {
  try {
    console.log("🔍 Getting details for:", title);

    const detailResponse = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title
      )}`
    );

    if (!detailResponse.ok) {
      console.log(
        "⚠️ Detail fetch failed for:",
        title,
        "Status:",
        detailResponse.status
      );
      return null;
    }

    const detailData = await detailResponse.json();
    console.log("✅ Got details for:", title);

    // Extract birth year
    const birthYearMatch = detailData.extract.match(/\b(19|18|20)\d{2}\b/);
    const birthYear = birthYearMatch ? parseInt(birthYearMatch[0]) : 0;

    // Extract profession
    const professionMatch = detailData.extract.match(
      /(?:was|is|a|an)\s+([^,\.]+?)(?:,|\.|who|and)/i
    );
    const profession = professionMatch
      ? professionMatch[1].trim()
      : "Notable Person";

    // Extract achievements
    const achievements = extractAchievements(detailData.extract);

    const person = {
      id: detailData.pageid?.toString() || Math.random().toString(),
      name: detailData.title,
      profession,
      birthYear,
      achievements,
      background: detailData.extract.substring(0, 200) + "...",
      imageUrl: detailData.thumbnail?.source,
      wikipediaUrl:
        detailData.content_urls?.desktop?.page || detailData.fullurl,
    };

    console.log("👤 Processed person:", person.name, person.profession);
    return person;
  } catch (error) {
    console.error(`❌ Error getting details for "${title}":`, error);
    return null;
  }
}

function extractAchievements(extract: string): string[] {
  const achievements: string[] = [];

  const achievementPatterns = [
    /(?:known for|famous for|best known for|noted for)\s+([^\.]+)/gi,
    /(?:won|awarded|received)\s+([^\.]+)/gi,
    /(?:wrote|created|painted|composed|discovered|invented)\s+([^\.]+)/gi,
    /(?:author of|creator of|painter of|composer of)\s+([^\.]+)/gi,
  ];

  for (const pattern of achievementPatterns) {
    const matches = extract.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        const achievement = match
          .replace(
            /^(?:known for|famous for|best known for|noted for|won|awarded|received|wrote|created|painted|composed|discovered|invented|author of|creator of|painter of|composer of)\s+/i,
            ""
          )
          .trim();
        if (achievement.length > 10 && achievement.length < 100) {
          achievements.push(achievement);
        }
      });
    }
  }

  if (achievements.length === 0) {
    const profession = extract.match(
      /(?:was|is|a|an)\s+([^,\.]+?)(?:,|\.|who|and)/i
    );
    if (profession) {
      const prof = profession[1].toLowerCase();
      if (prof.includes("actor") || prof.includes("actress")) {
        achievements.push("Film and television performances");
      } else if (prof.includes("musician") || prof.includes("singer")) {
        achievements.push("Musical compositions and performances");
      } else if (prof.includes("writer") || prof.includes("author")) {
        achievements.push("Literary works and publications");
      } else if (prof.includes("artist") || prof.includes("painter")) {
        achievements.push("Artistic creations and exhibitions");
      } else if (prof.includes("scientist") || prof.includes("researcher")) {
        achievements.push("Scientific discoveries and research");
      } else {
        achievements.push("Significant contributions to their field");
      }
    }
  }

  return achievements.slice(0, 3);
}
