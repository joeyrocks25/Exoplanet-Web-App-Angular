import { Component, ViewChild, ElementRef, Renderer2, OnDestroy, OnInit } from '@angular/core';
import { SharedPlanetService } from 'src/app/services/shared/comments-planet';
import { CommentsService } from 'src/app/services/comments.service';
import { Comment } from 'src/app/interfaces/comment.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgZone } from '@angular/core';
import { RefreshService } from 'src/app/services/shared/refresh.service';

@Component({
  selector: 'app-planet-comments',
  templateUrl: './planet-comments.component.html',
  styleUrls: ['./planet-comments.component.css']
})
export class PlanetCommentsComponent implements OnDestroy, OnInit {
  @ViewChild('commentBox') commentBox!: ElementRef;

  comments: Comment[] = [];
  showCommentBox: boolean = false;
  newComment: string = '';
  editCommentIndex: number | undefined = undefined;
  isEditing: boolean = false;
  deckId: string = '';
  planetId: string = '';
  private selectedDeckSubscription: Subscription | undefined;
  private selectedPlanetSubscription: Subscription | undefined;
  private commentsRefreshSubscription: Subscription | undefined;

  constructor(
    private renderer: Renderer2,
    private sharedPlanetService: SharedPlanetService,
    private commentsService: CommentsService,
    private snackBar: MatSnackBar,
    private zone: NgZone,
    private refreshService: RefreshService,
  ) {}

  // Initialize component by subscribing to selected deck and planet IDs.
  ngOnInit(): void {

    this.selectedDeckSubscription = this.sharedPlanetService.selectedDeckId$.subscribe((deckId) => {
      console.log('Selected Deck ID:', deckId);
      this.deckId = deckId;
    });

    this.selectedPlanetSubscription = this.sharedPlanetService.selectedPlanetId$.subscribe((planetId) => {
      console.log('Selected Planet ID:', planetId);
      this.planetId = planetId;
      this.loadComments();
    });

    // Subscribe to service for deleting planet, Observable to refresh comments
    this.commentsRefreshSubscription = this.refreshService.planetDeleted$.subscribe(() => {
      console.log('Received notification to refresh comments...');
      console.log("clearing comments", this.clearComments)
      this.clearComments().then(() => {
        this.loadComments();
      });
    });
  }

  // Unsubscribe from subscriptions to prevent memory leaks.
  ngOnDestroy(): void {
    this.sharedPlanetService.clearSelectedPlanetId();
    this.selectedDeckSubscription?.unsubscribe();
    this.selectedPlanetSubscription?.unsubscribe();
    this.commentsRefreshSubscription?.unsubscribe();
  }

  // Toggle the visibility of the comment box.
  toggleCommentBox() {
    this.showCommentBox = !this.showCommentBox;
    if (this.showCommentBox) {
      setTimeout(() => {
        this.adjustCommentBoxHeight();
      });
    }
  }

  // Add a new comment to the planet.
  addComment() {
    if (this.newComment.trim() !== '') {
      const newComment: Comment = { content: this.newComment };
      this.comments.push(newComment);
      this.newComment = '';
      this.toggleCommentBox();
  
      this.commentsService.addCommentsToPlanet(this.deckId, this.planetId, [newComment.content]).subscribe(
        (response: string) => {
          console.log('Server Response:', response);
  
          const addedCommentIndex = this.comments.findIndex(comment => comment === newComment);
          if (addedCommentIndex !== -1) {
            this.comments.splice(addedCommentIndex, 1);
          }
  
          this.zone.run(() => {
            this.comments.push(newComment);
          });
  
          this.clearComments().then(() => {
            this.loadComments();
          });
  
          this.showSnackbar('Comment added successfully', 'success');
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }

  // Adjust the height of the comment box based on its content.
  adjustCommentBoxHeight() {
    const box = this.commentBox.nativeElement;
    const scrollHeight = box.scrollHeight;
    this.renderer.setStyle(box, 'height', `${scrollHeight}px`);
  }

  // Load comments for the selected deck and planet.
  loadComments(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.deckId && this.planetId) {
        this.commentsService.getCommentsForPlanet(this.deckId, this.planetId).subscribe(
          (response) => {
            if (response.comments && response.comments.length > 0) {
              this.comments = response.comments;
              console.log('Comments for the planet fetched successfully:', this.comments);
            } else {
              this.clearComments();
            }
            resolve();
          },
          (error) => {
            console.error('Error fetching comments for the planet:', error);
            reject(error);
          }
        );
      } else {
        resolve();
      }
    });
  }

  // Begin the editing process for a specific comment.
  editComment(index: number, comment: Comment) {
    console.log(`Editing comment at index ${index}: ${comment.content}`);
    this.editCommentIndex = index;
    this.isEditing = true;
  }

  // Update an existing comment.
  // Call the updateComment method from the service.
  updateComment(index: number, comment: Comment) {
    console.log(`Updating comment at index ${index}: ${comment.content}`);
    const originalContent = comment.content;

    this.commentsService.updateComment(this.deckId, this.planetId, comment.id!, comment.content).subscribe(
      (response) => {
        console.log('Comment updated successfully:', response);
        this.isEditing = false;
        this.showSnackbar('Comment updated successfully', 'success');
      },
      (error) => {
        console.error('Error updating comment:', error);
      }
    );
  }

  // Method to delete a specific comment.
  deleteComment(commentId: string | undefined) {
    if (!commentId) {
      console.error('Error: Comment ID is undefined.');
      return;
    }
    console.log(`Deleting comment with ID ${commentId}`);
    this.commentsService.deleteComment(this.deckId, this.planetId, commentId).subscribe(
      (response) => {
        console.log('Comment deleted successfully:', response);
        this.comments = this.comments.filter(comment => comment.id !== commentId);
        this.showSnackbar('Comment deleted successfully', 'success');
      },
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  // Method to clear comments after deleting a planet
  clearComments(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.comments = [];
      resolve();
    });
  }

  // Function to show a snackbar with the given message and styling
  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
