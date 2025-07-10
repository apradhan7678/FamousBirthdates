"use client";

import { useState } from "react";
import BirthdateForm from "@/components/BirthdateForm";
import FamousPersonCard from "@/components/FamousPersonCard";
import ThemeToggle from "@/components/ThemeToggle";
import {
  getFamousPeopleForDate,
  formatDate,
  FamousPerson,
} from "@/utils/fakeData";
import styles from "./page.module.css";

export default function Home() {
  const [famousPeople, setFamousPeople] = useState<FamousPerson[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (birthdate: Date) => {
    setIsLoading(true);
    setSelectedDate(birthdate);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const people = getFamousPeopleForDate(birthdate);
    setFamousPeople(people);
    setHasSearched(true);
    setIsLoading(false);
  };

  return (
    <main className={styles.main}>
      <ThemeToggle />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Famous Birthdates</h1>
          <p className={styles.subtitle}>
            Discover the famous people who share your birthdate
          </p>
        </header>

        <section className={styles.formSection}>
          <BirthdateForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {hasSearched && (
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
            ) : (
              <div className={styles.cardsGrid}>
                {famousPeople.map((person) => (
                  <FamousPersonCard key={person.id} person={person} />
                ))}
              </div>
            )}
          </section>
        )}

        {!hasSearched && !isLoading && (
          <section className={styles.placeholder}>
            <div className={styles.placeholderContent}>
              <div className={styles.placeholderIcon}>🎂</div>
              <h3>Enter your birthdate to get started</h3>
              <p>Find out which famous people share your special day!</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
