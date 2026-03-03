import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore"
import { db } from "./config"
import { PRESET_EXERCISES } from "@/lib/constants/exercises"
import type { Exercise, WorkoutLog, WorkoutFormData, WorkoutFilter, BodyPhoto } from "@/lib/types"

// ── 種目関連 ──

export async function initializeExercises(userId: string) {
  const batch = writeBatch(db)
  const exercisesRef = collection(db, "users", userId, "exercises")

  PRESET_EXERCISES.forEach((exercise, index) => {
    const docRef = doc(exercisesRef)
    batch.set(docRef, {
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      isDefault: true,
      order: index,
    })
  })

  await batch.commit()
}

export async function getExercises(userId: string): Promise<Exercise[]> {
  const exercisesRef = collection(db, "users", userId, "exercises")
  const q = query(exercisesRef, orderBy("order", "asc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Exercise[]
}

export async function addExercise(
  userId: string,
  exercise: Omit<Exercise, "id">
): Promise<string> {
  const exercisesRef = collection(db, "users", userId, "exercises")
  const docRef = await addDoc(exercisesRef, exercise)
  return docRef.id
}

export async function updateExercise(
  userId: string,
  exerciseId: string,
  data: Partial<Exercise>
) {
  const docRef = doc(db, "users", userId, "exercises", exerciseId)
  await updateDoc(docRef, data)
}

export async function deleteExercise(userId: string, exerciseId: string) {
  const docRef = doc(db, "users", userId, "exercises", exerciseId)
  await deleteDoc(docRef)
}

// ── ワークアウト記録関連 ──

export async function addWorkout(
  userId: string,
  data: WorkoutFormData & { exerciseName: string }
): Promise<string> {
  const workoutsRef = collection(db, "users", userId, "workouts")
  const volume = data.weightKg * data.reps * data.sets
  const docRef = await addDoc(workoutsRef, {
    exerciseId: data.exerciseId,
    exerciseName: data.exerciseName,
    date: data.date,
    weightKg: data.weightKg,
    reps: data.reps,
    sets: data.sets,
    volume,
    condition: data.condition || null,
    memo: data.memo || "",
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export async function getLatestWorkout(
  userId: string,
  exerciseId: string
): Promise<WorkoutLog | null> {
  const workoutsRef = collection(db, "users", userId, "workouts")
  const q = query(
    workoutsRef,
    where("exerciseId", "==", exerciseId),
    orderBy("createdAt", "desc"),
    limit(1)
  )
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as WorkoutLog
}

export async function getWorkouts(
  userId: string,
  filters?: WorkoutFilter,
  pageSize = 20,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ workouts: WorkoutLog[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const workoutsRef = collection(db, "users", userId, "workouts")
  const constraints: Parameters<typeof query>[1][] = []

  if (filters?.exerciseId) {
    constraints.push(where("exerciseId", "==", filters.exerciseId))
  }
  if (filters?.dateFrom) {
    constraints.push(where("date", ">=", filters.dateFrom))
  }
  if (filters?.dateTo) {
    constraints.push(where("date", "<=", filters.dateTo))
  }

  constraints.push(orderBy("date", "desc"))
  constraints.push(orderBy("createdAt", "desc"))
  constraints.push(limit(pageSize))

  if (lastDoc) {
    constraints.push(startAfter(lastDoc))
  }

  const q = query(workoutsRef, ...constraints)
  const snapshot = await getDocs(q)

  const workouts = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WorkoutLog[]

  const newLastDoc = snapshot.docs.length > 0
    ? snapshot.docs[snapshot.docs.length - 1]
    : null

  return { workouts, lastDoc: newLastDoc }
}

export async function getAllWorkouts(
  userId: string,
  filters?: WorkoutFilter
): Promise<WorkoutLog[]> {
  const workoutsRef = collection(db, "users", userId, "workouts")
  const constraints: Parameters<typeof query>[1][] = []

  if (filters?.exerciseId) {
    constraints.push(where("exerciseId", "==", filters.exerciseId))
  }
  if (filters?.dateFrom) {
    constraints.push(where("date", ">=", filters.dateFrom))
  }
  if (filters?.dateTo) {
    constraints.push(where("date", "<=", filters.dateTo))
  }

  constraints.push(orderBy("date", "desc"))

  const q = query(workoutsRef, ...constraints)
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WorkoutLog[]
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  data: Partial<WorkoutFormData>
) {
  const docRef = doc(db, "users", userId, "workouts", workoutId)
  const updateData: Record<string, unknown> = { ...data }

  if (data.weightKg !== undefined && data.reps !== undefined && data.sets !== undefined) {
    updateData.volume = data.weightKg * data.reps * data.sets
  }

  await updateDoc(docRef, updateData)
}

export async function deleteWorkout(userId: string, workoutId: string) {
  const docRef = doc(db, "users", userId, "workouts", workoutId)
  await deleteDoc(docRef)
}

// ── 統計関連 ──

export async function getWorkoutStats(
  userId: string,
  exerciseId: string,
  dateFrom?: string,
  dateTo?: string
) {
  const workoutsRef = collection(db, "users", userId, "workouts")
  const constraints: Parameters<typeof query>[1][] = [
    where("exerciseId", "==", exerciseId),
  ]

  if (dateFrom) constraints.push(where("date", ">=", dateFrom))
  if (dateTo) constraints.push(where("date", "<=", dateTo))
  constraints.push(orderBy("date", "asc"))

  const q = query(workoutsRef, ...constraints)
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WorkoutLog[]
}

export async function getBodyPartStats(
  userId: string,
  dateFrom?: string,
  dateTo?: string
) {
  const workoutsRef = collection(db, "users", userId, "workouts")
  const constraints: Parameters<typeof query>[1][] = []

  if (dateFrom) constraints.push(where("date", ">=", dateFrom))
  if (dateTo) constraints.push(where("date", "<=", dateTo))

  const q = query(workoutsRef, ...constraints)
  const snapshot = await getDocs(q)

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WorkoutLog[]
}

// ── ワークアウト日付一覧 ──

export async function getWorkoutDates(
  userId: string,
  month: string // YYYY-MM
): Promise<string[]> {
  const workoutsRef = collection(db, "users", userId, "workouts")
  const q = query(
    workoutsRef,
    where("date", ">=", `${month}-01`),
    where("date", "<=", `${month}-31`),
    orderBy("date", "asc")
  )
  const snapshot = await getDocs(q)
  const dates = new Set<string>()
  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    if (data.date) dates.add(data.date)
  })
  return Array.from(dates)
}

// ── 写真関連 ──

export async function addPhoto(
  userId: string,
  data: Omit<BodyPhoto, "id">
): Promise<string> {
  const photosRef = collection(db, "users", userId, "photos")
  const docRef = await addDoc(photosRef, data)
  return docRef.id
}

export async function getPhotos(userId: string): Promise<BodyPhoto[]> {
  const photosRef = collection(db, "users", userId, "photos")
  const q = query(photosRef, orderBy("createdAt", "desc"))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as BodyPhoto[]
}

export async function deletePhotoRecord(userId: string, photoId: string) {
  const docRef = doc(db, "users", userId, "photos", photoId)
  await deleteDoc(docRef)
}

// ── ユーザープロフィール ──

export async function updateUserProfile(userId: string, data: { displayName: string }) {
  const docRef = doc(db, "users", userId)
  await setDoc(docRef, { ...data, updatedAt: Timestamp.now() }, { merge: true })
}

export async function getUserProfile(userId: string) {
  const docRef = doc(db, "users", userId)
  const snapshot = await getDoc(docRef)
  return snapshot.exists() ? snapshot.data() : null
}
