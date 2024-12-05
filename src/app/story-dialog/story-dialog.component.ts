import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-story-dialog',
  templateUrl: './story-dialog.component.html',
  styleUrl: './story-dialog.component.css'
})
export class StoryDialogComponent {
  stories = [
    { title: 'The Brave Adventurer' },
    { title: 'The Curious Fox' }
  ];

  constructor(private dialogRef: MatDialogRef<StoryDialogComponent>) {}

  selectStory(index: number) {
    this.dialogRef.close(index);
  }
}
