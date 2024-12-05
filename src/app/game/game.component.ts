import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoryDialogComponent } from '../story-dialog/story-dialog.component';
import { stories } from './stories';
import { adjectives, nouns, verbs, adverbs } from './word'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})

export class GameComponent {

  stories: { title: string; blanks: { text: string; type: string }[] }[] = stories;

  selectedStoryIndex: number = 0;

  adjectives: string[] = adjectives;
  nouns: string[] = nouns;
  verbs: string[] = verbs;
  adverbs: string[] = adverbs;

  userInputs: string[] = Array(this.stories[this.selectedStoryIndex].blanks.length).fill('______');
  isTextVisible: boolean = false;

  adjectiveUsage: number[] = Array(this.adjectives.length).fill(0);
  nounUsage: number[] = Array(this.nouns.length).fill(0);
  verbUsage: number[] = Array(this.verbs.length).fill(0);
  adverbUsage: number[] = Array(this.adverbs.length).fill(0);

  changeStory(event: Event): void {
    const target = event.target as HTMLSelectElement | null; 
    if (target) { 
      const selectedValue = target.value;
      this.selectedStoryIndex = +selectedValue;
      this.userInputs = Array(this.stories[this.selectedStoryIndex].blanks.length).fill('______');
      this.resetWordUsage(); 
      this.checkAllFilled();
    }
  }

  resetWordUsage() {
    this.adjectiveUsage = Array(this.adjectives.length).fill(0);
    this.nounUsage = Array(this.nouns.length).fill(0);
    this.verbUsage = Array(this.verbs.length).fill(0);
    this.adverbUsage = Array(this.adverbs.length).fill(0);
  }

  onDragStart(event: DragEvent, word: string, type: string) {
    event.dataTransfer?.setData('text/plain', word);
    event.dataTransfer?.setData('type', type);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, index: number, expectedType: string) {
    event.preventDefault();
    const word = event.dataTransfer?.getData('text/plain');
    const wordType = event.dataTransfer?.getData('type');

    if (word && wordType === expectedType) {
      this.userInputs[index] = word;
      this.updateWordUsage(word, expectedType);
      this.checkAllFilled();
    } else {
      alert(`Please drop a valid ${expectedType} in this blank!`);
    }
  }

  clearWord(index: number) {
    const word = this.userInputs[index];
    if (word !== '______') {
      const wordType = this.getWordType(word); 
      if (wordType) { 
        this.updateWordUsage(word, wordType, true); 
      }
    }
    this.userInputs[index] = '______';
    this.checkAllFilled();
  }

  isAllBlanksFilled(): boolean {
    return this.userInputs.every(input => input.trim() !== '______');
  }

  toggleText() {
    this.isTextVisible = !this.isTextVisible;
  }

  checkAllFilled() {
    this.isTextVisible = this.userInputs.every(input => input.trim() !== '______');
  }

  updateWordUsage(word: string, wordType: string, isClearing: boolean = false) {
    const updateFunction = isClearing ? this.decrementUsage : this.incrementUsage;

    switch (wordType) {
      case 'adjective':
        const adjIndex = this.adjectives.indexOf(word);
        if (adjIndex > -1) {
          updateFunction.call(this, adjIndex, 'adjective');
        }
        break;
      case 'noun':
        const nounIndex = this.nouns.indexOf(word);
        if (nounIndex > -1) {
          updateFunction.call(this, nounIndex, 'noun');
        }
        break;
      case 'verb':
        const verbIndex = this.verbs.indexOf(word);
        if (verbIndex > -1) {
          updateFunction.call(this, verbIndex, 'verb');
        }
        break;
      case 'adverb':
        const adverbIndex = this.adverbs.indexOf(word);
        if (adverbIndex > -1) {
          updateFunction.call(this, adverbIndex, 'adverb');
        }
        break;
    }
  }

  incrementUsage(index: number, wordType: string) {
    switch (wordType) {
      case 'adjective':
        this.adjectiveUsage[index]++;
        break;
      case 'noun':
        this.nounUsage[index]++;
        break;
      case 'verb':
        this.verbUsage[index]++;
        break;
      case 'adverb':
        this.adverbUsage[index]++;
        break;
    }
  }

  decrementUsage(index: number, wordType: string) {
    switch (wordType) {
      case 'adjective':
        this.adjectiveUsage[index] = Math.max(0, this.adjectiveUsage[index] - 1);
        break;
      case 'noun':
        this.nounUsage[index] = Math.max(0, this.nounUsage[index] - 1);
        break;
      case 'verb':
        this.verbUsage[index] = Math.max(0, this.verbUsage[index] - 1);
        break;
      case 'adverb':
        this.adverbUsage[index] = Math.max(0, this.adverbUsage[index] - 1);
        break;
    }
  }

  getWordType(word: string): string | null {
    if (this.adjectives.includes(word)) return 'adjective';
    if (this.nouns.includes(word)) return 'noun';
    if (this.verbs.includes(word)) return 'verb';
    if (this.adverbs.includes(word)) return 'adverb';
    return null; 
  }

  resetGame(): void {
    this.userInputs = Array(this.stories[this.selectedStoryIndex].blanks.length).fill('______');  
    this.adjectiveUsage = new Array(this.adjectives.length).fill(0);
    this.nounUsage = new Array(this.nouns.length).fill(0);
    this.verbUsage = new Array(this.verbs.length).fill(0);
    this.adverbUsage = new Array(this.adverbs.length).fill(0);
    this.isTextVisible = false;  
  }

  constructor(private dialog: MatDialog) {}

  openStoryDialog() {
    const dialogRef = this.dialog.open(StoryDialogComponent);

    dialogRef.afterClosed().subscribe(selectedIndex => {
      if (selectedIndex !== undefined) {
        this.selectedStoryIndex = selectedIndex;
        this.userInputs = Array(this.stories[this.selectedStoryIndex].blanks.length).fill('______');
        this.resetWordUsage();
        this.checkAllFilled();
      }
    });
  }
}
