"use client";

import { useState } from "react";
import BirthdateForm from "@/components/BirthdateForm";
import FamousPersonCard from "@/components/FamousPersonCard";
import ThemeToggle from "@/components/ThemeToggle";
import { BackgroundLines } from "@/components/ui/background-lines";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { TracingBeam } from "@/components/ui/tracing-beam";
import {
  getFamousPeopleForDate,
  formatDate,
  WikimediaPerson,
} from "@/utils/wikimediaApi";
import styles from "./page.module.css";

export default function Home() {
  const [famousPeople, setFamousPeople] = useState<WikimediaPerson[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (birthdate: Date) => {
    setIsLoading(true);
    setError(null);
    setSelectedDate(birthdate);

    console.log("🔍 Searching for famous people for:", birthdate);

    try {
      const people = await getFamousPeopleForDate(birthdate);
      setFamousPeople(people);
      setHasSearched(true);
    } catch (err) {
      setError("Failed to fetch famous people. Please try again.");
      console.error("Error fetching famous people:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuroraBackground className={styles.main}>
      <TracingBeam className={styles.tracingBeam}>
        <ThemeToggle />
        <div className={styles.container}>
          <BackgroundLines
            className={styles.header}
            svgOptions={{ duration: 8 }}
          >
            <h1 className={styles.title}>Famous Birthdates</h1>
            <p className={styles.subtitle}>
              Discover the famous people who share your birthdate
            </p>
          </BackgroundLines>

          <section className={styles.formSection}>
            <BirthdateForm onSubmit={handleSubmit} isLoading={isLoading} />
          </section>

          {error && (
            <section className={styles.errorSection}>
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            </section>
          )}

          {hasSearched && !error && (
            <section className={styles.resultsSection}>
              {selectedDate && (
                <div className={styles.dateDisplay}>
                  <h2>Famous People Born on {formatDate(selectedDate)}</h2>
                </div>
              )}

              {isLoading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <p>Finding famous people...</p>
                </div>
              ) : famousPeople.length > 0 ? (
                <div className={styles.cardsGrid}>
                  {famousPeople.map((person, index) => (
                    <FamousPersonCard
                      key={person.id}
                      person={person}
                      className={styles[`cardDelay${index}`]}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <div className={styles.noResultsIcon}>🔍</div>
                  <h3>No Information Found</h3>
                  <p>
                    We couldn&apos;t find any famous people born on this date
                    using the Wikimedia database.
                  </p>
                  <p>
                    Try a different date or check back later as we continue to
                    expand our data.
                  </p>
                </div>
              )}
            </section>
          )}

          {!hasSearched && !isLoading && !error && (
            <section className={styles.placeholder}>
              <div className={styles.placeholderContent}>
                <div className={styles.placeholderIcon}>🎂</div>
                <h3>Enter your birthdate to get started</h3>
                <p>Find out which famous people share your special day!</p>
              </div>
            </section>
          )}
        </div>
      </TracingBeam>
    </AuroraBackground>
  );
}
