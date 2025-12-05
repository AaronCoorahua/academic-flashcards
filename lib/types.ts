// Database Types
export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Topic = {
  id: string;
  user_id: string;
  title: string;
  
  color_theme: 'amber' | 'emerald' | 'violet' | 'rose';
  created_at: string;
  updated_at: string;
};

export type Assignment = {
  id: string;
  topic_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type FlashcardStatus = 'new' | 'learning' | 'mastered';

export type Flashcard = {
  id: string;
  assignment_id: string;
  question: string;
  answer: string;
  media_url: string | null;
  status: FlashcardStatus;
  created_at: string;
  updated_at: string;
};

// DTO Types for creating/updating
export type CreateTopicDto = Omit<Topic, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTopicDto = Partial<CreateTopicDto>;

export type CreateAssignmentDto = Omit<Assignment, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAssignmentDto = Partial<CreateAssignmentDto>;

export type CreateFlashcardDto = Omit<Flashcard, 'id' | 'created_at' | 'updated_at'>;
export type UpdateFlashcardDto = Partial<CreateFlashcardDto>;
