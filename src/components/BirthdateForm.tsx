"use client";

import { useState } from "react";
import styles from "./BirthdateForm.module.css";

interface BirthdateFormProps {
  onSubmit: (birthdate: Date) => void;
  isLoading?: boolean;
}

export default function BirthdateForm({
  onSubmit,
  isLoading = false,
}: BirthdateFormProps) {
  const [birthdate, setBirthdate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthdate) {
      // Create date in local timezone to avoid timezone issues
      const [year, month, day] = birthdate.split("-").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      console.log("Original input:", birthdate);
      console.log("Created date:", date);
      console.log("Date parts:", { year, month, day });
      onSubmit(date);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && birthdate) {
      // Create date in local timezone to avoid timezone issues
      const [year, month, day] = birthdate.split("-").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      onSubmit(date);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="birthdate" className={styles.label}>
          Enter Your Birthdate
        </label>
        <div className={styles.inputWrapper}>
          <input
            type="date"
            id="birthdate"
            value={birthdate}
            onChange={(e) => {
              console.log(e.target.value);
              setBirthdate(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            className={styles.input}
            required
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={!birthdate || isLoading}
      >
        {isLoading ? "Finding Famous People..." : "Find Famous People"}
      </button>
    </form>
  );
}
