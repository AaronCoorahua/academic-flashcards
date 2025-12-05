-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: topics
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  color_theme TEXT DEFAULT 'violet' CHECK (color_theme IN ('amber', 'emerald', 'violet', 'rose')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla: flashcards
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  media_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'learning', 'mastered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_topics_user_id ON topics(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_topic_id ON assignments(topic_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_assignment_id ON flashcards(assignment_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_status ON flashcards(status);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas RLS para topics
DROP POLICY IF EXISTS "Users can view own topics" ON topics;
CREATE POLICY "Users can view own topics" ON topics
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own topics" ON topics;
CREATE POLICY "Users can create own topics" ON topics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own topics" ON topics;
CREATE POLICY "Users can update own topics" ON topics
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own topics" ON topics;
CREATE POLICY "Users can delete own topics" ON topics
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para assignments
DROP POLICY IF EXISTS "Users can view own assignments" ON assignments;
CREATE POLICY "Users can view own assignments" ON assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM topics 
      WHERE topics.id = assignments.topic_id 
      AND topics.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create own assignments" ON assignments;
CREATE POLICY "Users can create own assignments" ON assignments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM topics 
      WHERE topics.id = assignments.topic_id 
      AND topics.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own assignments" ON assignments;
CREATE POLICY "Users can update own assignments" ON assignments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM topics 
      WHERE topics.id = assignments.topic_id 
      AND topics.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own assignments" ON assignments;
CREATE POLICY "Users can delete own assignments" ON assignments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM topics 
      WHERE topics.id = assignments.topic_id 
      AND topics.user_id = auth.uid()
    )
  );

-- Políticas RLS para flashcards
DROP POLICY IF EXISTS "Users can view own flashcards" ON flashcards;
CREATE POLICY "Users can view own flashcards" ON flashcards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN topics ON topics.id = assignments.topic_id
      WHERE assignments.id = flashcards.assignment_id
      AND topics.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create own flashcards" ON flashcards;
CREATE POLICY "Users can create own flashcards" ON flashcards
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN topics ON topics.id = assignments.topic_id
      WHERE assignments.id = flashcards.assignment_id
      AND topics.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own flashcards" ON flashcards;
CREATE POLICY "Users can update own flashcards" ON flashcards
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN topics ON topics.id = assignments.topic_id
      WHERE assignments.id = flashcards.assignment_id
      AND topics.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own flashcards" ON flashcards;
CREATE POLICY "Users can delete own flashcards" ON flashcards
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM assignments
      JOIN topics ON topics.id = assignments.topic_id
      WHERE assignments.id = flashcards.assignment_id
      AND topics.user_id = auth.uid()
    )
  );

-- Función para auto-crear perfil después del registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
