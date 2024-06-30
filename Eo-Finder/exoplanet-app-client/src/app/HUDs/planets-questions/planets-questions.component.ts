// planets-questions.component.ts
import { Component, OnInit } from '@angular/core';
import { SharedPlanetService } from 'src/app/services/shared/comments-planet';
import { DeckService } from 'src/app/services/deck.services';

@Component({
  selector: 'app-planets-questions',
  templateUrl: './planets-questions.component.html',
  styleUrls: ['./planets-questions.component.css']
})
export class PlanetsQuestionsComponent implements OnInit {
  selectedDeckId: string = '';
  questionsAndAnswers: { question: string; value: string; userAnswer?: string }[] = [];
  score: number = 0;

  constructor(
    private sharedPlanetService: SharedPlanetService,
    private deckService: DeckService
  ) {}

   // Subscribe to changes in the selected deck ID from shared service
  ngOnInit(): void {
    this.sharedPlanetService.selectedDeckId$.subscribe((deckId) => {
      this.selectedDeckId = deckId;
      this.questionsAndAnswers = [];
      this.score = 0;
    });
  }

  // Triggered when the "Generate Random Questions" button is clicked
  // Call a method to generate random questions for the selected deck
  onGenerateQuestionsClick(): void {
    if (this.selectedDeckId) {
      // Reset the score to 0 before generating questions
      this.score = 0;
      this.generateRandomQuestions(this.selectedDeckId);
    } else {
      console.error('No deck selected');
    }
  }

  // Generate random questions for the planets in the specified deck
  generateRandomQuestions(deckId: string): void {
    this.deckService.getDeckRandomQuestions(deckId).subscribe((questions: { random_questions: { question: string; value: string }[] }) => {
      console.log('Random Questions:', questions);
      this.questionsAndAnswers = questions.random_questions.map((q) => ({
        question: q.question,
        value: q.value,
        userAnswer: ''
      }));
    });
  }

  // Triggered when the "Submit Answers" button is clicked
  onAnswerQuestionsClick(): void {
    this.score = this.calculateScore();
    console.log('Score:', this.score);
  }

  // Calculate the score based on user answers
  private calculateScore(): number {
    let correctAnswers = 0;
    for (const qa of this.questionsAndAnswers) {
      if (qa.userAnswer && qa.userAnswer.toLowerCase() === qa.value.toLowerCase()) {
        correctAnswers++;
      }
    }
    return correctAnswers;
  }
}
