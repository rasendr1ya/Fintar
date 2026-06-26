"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LessonForm } from "@/features/admin/components/LessonForm";
import { ChallengeForm } from "@/features/admin/components/ChallengeForm";
import {
  deleteUnit,
  deleteLesson,
  deleteChallenge,
  reorderUnits,
  reorderLessons,
  reorderChallenges,
} from "@/features/admin/actions";
import type { UnitWithLessons, Lesson, Challenge } from "@/types/database";
import { showSuccess, showError } from "@/lib/toast";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ========================================
   Sortable Unit Item
   ======================================== */

interface SortableUnitProps {
  unit: UnitWithLessons;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  isLoading: boolean;
  expandedLessons: Set<string>;
  onToggleLesson: (id: string) => void;
  editingLesson: string | null;
  onEditLesson: (id: string | null) => void;
  addingLesson: string | null;
  onAddLesson: (id: string | null) => void;
  onDeleteLesson: (lessonId: string) => void;
  onSaveLesson: () => void;
  addingChallenge: string | null;
  onAddChallenge: (id: string | null) => void;
  onEditChallenge: (c: Challenge | null) => void;
  onDeleteChallenge: (lessonId: string, challengeId: string) => void;
  onSaveChallenge: () => void;
  loadingId: string | null;
  onReorderLessons: (unitId: string, orderedIds: string[]) => void;
  onReorderChallenges: (lessonId: string, orderedIds: string[]) => void;
}

function SortableUnit({
  unit,
  isExpanded,
  onToggle,
  onDelete,
  isLoading,
  expandedLessons,
  onToggleLesson,
  editingLesson,
  onEditLesson,
  addingLesson,
  onAddLesson,
  onDeleteLesson,
  onSaveLesson,
  addingChallenge,
  onAddChallenge,
  onEditChallenge,
  onDeleteChallenge,
  onSaveChallenge,
  loadingId,
  onReorderLessons,
  onReorderChallenges,
}: SortableUnitProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: unit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const lessonIds = unit.lessons.map((l) => l.id);

  const handleLessonDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = lessonIds.indexOf(active.id as string);
      const newIndex = lessonIds.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...unit.lessons];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      onReorderLessons(unit.id, reordered.map((l) => l.id));
    },
    [unit, lessonIds, onReorderLessons]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div ref={setNodeRef} style={style} className="bg-white rounded-2xl border border-border overflow-hidden">
      {/* Unit Header */}
      <div className="px-6 py-4 bg-gray-50 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            suppressHydrationWarning
            className="p-1 text-muted hover:text-text transition-colors cursor-grab active:cursor-grabbing shrink-0"
            title="Drag to reorder"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          <button
            onClick={onToggle}
            className="p-1 text-muted hover:text-text transition-colors"
          >
            {isExpanded ? (
              <ChevronDownIcon className="w-5 h-5" />
            ) : (
              <ChevronRightIcon className="w-5 h-5" />
            )}
          </button>

          <div
            className="w-4 h-4 rounded-full shrink-0"
            style={{ backgroundColor: unit.color_theme || "#7C3AED" }}
          />

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-text truncate">{unit.title}</p>
            {unit.description && (
              <p className="text-sm text-muted truncate">{unit.description}</p>
            )}
          </div>

          <span className="text-xs text-muted shrink-0">
            {unit.lessons.length} lesson
          </span>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href={`/admin/lessons/units/${unit.id}/edit`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit unit"
            >
              <PencilIcon className="w-4 h-4 text-muted" />
            </Link>
            <button
              onClick={onDelete}
              disabled={isLoading}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Hapus unit"
            >
              <TrashIcon className="w-4 h-4 text-hearts" />
            </button>
          </div>
        </div>
      </div>

      {/* Unit Body (expandable) */}
      {isExpanded && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleLessonDragEnd}
        >
          <SortableContext
            items={lessonIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="p-4 space-y-3">
              {unit.lessons.map((lesson) => (
                <SortableLesson
                  key={lesson.id}
                  lesson={lesson}
                  unitId={unit.id}
                  isExpanded={expandedLessons.has(lesson.id)}
                  onToggle={() => onToggleLesson(lesson.id)}
                  isEditing={editingLesson === lesson.id}
                  onEdit={() => onEditLesson(editingLesson === lesson.id ? null : lesson.id)}
                  onSave={onSaveLesson}
                  onCancelEdit={() => onEditLesson(null)}
                  onDelete={() => onDeleteLesson(lesson.id)}
                  isLoading={loadingId === lesson.id}
                  challenges={(lesson as Lesson & { challenges?: Challenge[] }).challenges || []}
                  addingChallenge={addingChallenge === lesson.id}
                  onAddChallenge={() => onAddChallenge(lesson.id)}
                  onCloseAddChallenge={() => onAddChallenge(null)}
                  onEditChallenge={onEditChallenge}
                  onDeleteChallenge={(challengeId) => onDeleteChallenge(lesson.id, challengeId)}
                  onSaveChallenge={onSaveChallenge}
                  loadingId={loadingId}
                  onReorderChallenges={(orderedIds) => onReorderChallenges(lesson.id, orderedIds)}
                />
              ))}

              {addingLesson === unit.id ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <LessonForm
                    unitId={unit.id}
                    onSuccess={() => {
                      onAddLesson(null);
                      onSaveLesson();
                    }}
                    onCancel={() => onAddLesson(null)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    onAddLesson(unit.id);
                    onEditLesson(null);
                  }}
                  className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  <PlusIcon className="w-4 h-4" />
                  Tambah Lesson
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

/* ========================================
   Sortable Lesson Item
   ======================================== */

interface SortableLessonProps {
  lesson: Lesson;
  unitId: string;
  isExpanded: boolean;
  onToggle: () => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
  challenges: Challenge[];
  addingChallenge: boolean;
  onAddChallenge: () => void;
  onCloseAddChallenge: () => void;
  onEditChallenge: (c: Challenge | null) => void;
  onDeleteChallenge: (challengeId: string) => void;
  onSaveChallenge: () => void;
  loadingId: string | null;
  onReorderChallenges: (orderedIds: string[]) => void;
}

function SortableLesson({
  lesson,
  unitId,
  isExpanded,
  onToggle,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
  isLoading,
  challenges,
  addingChallenge,
  onAddChallenge,
  onCloseAddChallenge,
  onEditChallenge,
  onDeleteChallenge,
  onSaveChallenge,
  loadingId,
  onReorderChallenges,
}: SortableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const challengeIds = challenges.map((c) => c.id);

  const handleChallengeDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = challengeIds.indexOf(active.id as string);
      const newIndex = challengeIds.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...challenges];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      onReorderChallenges(reordered.map((c) => c.id));
    },
    [challenges, challengeIds, onReorderChallenges]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div ref={setNodeRef} style={style} className="bg-gray-50 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          {...attributes}
          {...listeners}
          suppressHydrationWarning
          className="p-1 text-muted hover:text-text transition-colors cursor-grab active:cursor-grabbing shrink-0"
          title="Drag to reorder"
        >
          <Bars3Icon className="w-4 h-4" />
        </button>

        <button
          onClick={onToggle}
          className="p-1 text-muted hover:text-text transition-colors shrink-0"
        >
          {isExpanded ? (
            <ChevronDownIcon className="w-4 h-4" />
          ) : (
            <ChevronRightIcon className="w-4 h-4" />
          )}
        </button>

        <span className="font-medium text-text text-sm flex-1 truncate">
          {lesson.title}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
            title="Edit lesson"
          >
            <PencilIcon className="w-3.5 h-3.5 text-muted" />
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
            title="Hapus lesson"
          >
            <TrashIcon className="w-3.5 h-3.5 text-hearts" />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="px-4 pb-4">
          <LessonForm
            unitId={unitId}
            lesson={lesson}
            onSuccess={() => {
              onCancelEdit();
              onSave();
            }}
            onCancel={onCancelEdit}
          />
        </div>
      )}

      {isExpanded && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleChallengeDragEnd}
        >
          <SortableContext
            items={challengeIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="px-4 pb-4">
              <div className="space-y-2">
                {challenges.length === 0 ? (
                  <p className="text-sm text-muted text-center py-4">
                    Belum ada challenge
                  </p>
                ) : (
                  challenges.map((challenge, idx) => (
                    <SortableChallenge
                      key={challenge.id}
                      challenge={challenge}
                      index={idx}
                      onEdit={() => onEditChallenge(challenge)}
                      onDelete={() => onDeleteChallenge(challenge.id)}
                      isLoading={loadingId === challenge.id}
                    />
                  ))
                )}
              </div>

              {addingChallenge ? (
                <div className="mt-3">
                  <ChallengeForm
                    lessonId={lesson.id}
                    onClose={onCloseAddChallenge}
                    onSave={() => onSaveChallenge()}
                  />
                </div>
              ) : (
                <button
                  onClick={onAddChallenge}
                  className="mt-3 flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  <PlusIcon className="w-4 h-4" />
                  Tambah Challenge
                </button>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

/* ========================================
   Sortable Challenge Item
   ======================================== */

interface SortableChallengeProps {
  challenge: Challenge;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

function SortableChallenge({
  challenge,
  index,
  onEdit,
  onDelete,
  isLoading,
}: SortableChallengeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: challenge.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 bg-white p-3 rounded-lg border border-border"
    >
      <button
        {...attributes}
        {...listeners}
        suppressHydrationWarning
        className="p-0.5 text-muted hover:text-text transition-colors cursor-grab active:cursor-grabbing shrink-0 mt-0.5"
        title="Drag to reorder"
      >
        <Bars3Icon className="w-3.5 h-3.5" />
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              challenge.type === "SELECT"
                ? "bg-xp/10 text-xp"
                : "bg-primary-50 text-primary"
            }`}
          >
            {challenge.type}
          </span>
          <span className="text-xs text-muted">Q{index + 1}</span>
        </div>
        <p className="text-sm font-medium text-text mb-2">{challenge.question}</p>
        <div className="flex flex-wrap gap-1.5">
          {(Array.isArray(challenge.options) ? challenge.options : []).map(
            (opt: string, i: number) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded-lg text-xs ${
                  opt === challenge.correct_answer
                    ? "bg-success/10 text-success font-medium"
                    : "bg-gray-100 text-muted"
                }`}
              >
                {opt}
                {opt === challenge.correct_answer && (
                  <CheckIcon className="w-3 h-3 inline ml-1" />
                )}
              </span>
            )
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit challenge"
        >
          <PencilIcon className="w-3.5 h-3.5 text-muted" />
        </button>
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus challenge"
        >
          <TrashIcon className="w-3.5 h-3.5 text-hearts" />
        </button>
      </div>
    </div>
  );
}

/* ========================================
   Main LessonsPageClient
   ======================================== */

interface LessonsPageClientProps {
  units: UnitWithLessons[];
}

export function LessonsPageClient({ units: initialUnits }: LessonsPageClientProps) {
  const router = useRouter();
  const [units, setUnits] = useState(initialUnits);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [addingLesson, setAddingLesson] = useState<string | null>(null);
  const [addingChallenge, setAddingChallenge] = useState<string | null>(null);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setUnits(initialUnits);
  }, [initialUnits]);

  const toggleUnit = (id: string) => {
    setExpandedUnits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLesson = (id: string) => {
    setExpandedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteUnit = async (id: string) => {
    if (!confirm("Yakin ingin menghapus unit ini? Semua lesson di dalamnya juga akan dihapus.")) return;
    setLoadingId(id);
    const result = await deleteUnit(id);
    if ("success" in result) {
      setUnits((prev) => prev.filter((u) => u.id !== id));
      showSuccess("Unit berhasil dihapus");
    } else {
      showError("Gagal menghapus unit");
    }
    setLoadingId(null);
  };

  const handleDeleteLesson = async (unitId: string, lessonId: string) => {
    const parentUnit = units.find((u) => u.id === unitId);
    const isLastLesson = (parentUnit?.lessons?.length ?? 0) <= 1;

    const confirmMessage = isLastLesson
      ? "Ini adalah lesson terakhir di unit ini. Jika dihapus, unit tidak akan muncul di halaman belajar pengguna sampai lesson baru ditambahkan. Hapus lesson ini?"
      : "Yakin ingin menghapus lesson ini?";

    if (!confirm(confirmMessage)) return;

    setLoadingId(lessonId);
    const result = await deleteLesson(lessonId);
    if ("success" in result) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId ? { ...u, lessons: u.lessons.filter((l) => l.id !== lessonId) } : u
        )
      );
      if (isLastLesson) {
        showSuccess("Lesson dihapus. Unit tidak akan tampil di halaman belajar sampai ada lesson baru.");
      } else {
        showSuccess("Lesson berhasil dihapus");
      }
    } else {
      showError("Gagal menghapus lesson");
    }
    setLoadingId(null);
  };

  const handleDeleteChallenge = async (unitId: string, lessonId: string, challengeId: string) => {
    if (!confirm("Yakin ingin menghapus challenge ini?")) return;
    setLoadingId(challengeId);
    const result = await deleteChallenge(challengeId);
    if ("success" in result) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId
            ? {
                ...u,
                lessons: u.lessons.map((l) =>
                  l.id === lessonId
                    ? { ...l, challenges: (l as Lesson & { challenges: Challenge[] }).challenges?.filter((c: Challenge) => c.id !== challengeId) || [] }
                    : l
                ),
              }
            : u
        )
      );
      showSuccess("Challenge berhasil dihapus");
    } else {
      showError("Gagal menghapus challenge");
    }
    setLoadingId(null);
  };

  const handleSaveChallenge = () => {
    setAddingChallenge(null);
    setEditingChallenge(null);
    router.refresh();
  };

  const handleSaveLesson = () => {
    setAddingLesson(null);
    setEditingLesson(null);
    router.refresh();
  };

  const handleReorderUnits = useCallback(async (orderedIds: string[]) => {
    const reordered = orderedIds
      .map((id) => units.find((u) => u.id === id))
      .filter(Boolean) as UnitWithLessons[];
    setUnits(reordered);
    await reorderUnits(orderedIds);
    router.refresh();
  }, [units, router]);

  const handleReorderLessons = useCallback(async (unitId: string, orderedIds: string[]) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id !== unitId) return u;
        const reordered = orderedIds
          .map((id) => u.lessons.find((l) => l.id === id))
          .filter(Boolean) as Lesson[];
        return { ...u, lessons: reordered };
      })
    );
    await reorderLessons(orderedIds);
    router.refresh();
  }, [router]);

  const handleReorderChallenges = useCallback(async (lessonId: string, orderedIds: string[]) => {
    await reorderChallenges(orderedIds);
    router.refresh();
  }, [router]);

  const unitIds = units.map((u) => u.id);

  const handleUnitDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = unitIds.indexOf(active.id as string);
      const newIndex = unitIds.indexOf(over.id as string);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...units];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      handleReorderUnits(reordered.map((u) => u.id));
    },
    [unitIds, units, handleReorderUnits]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (units.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <p className="text-muted mb-4">Belum ada unit pembelajaran</p>
        <Link href="/admin/lessons/units/new">
          <Button variant="primary" size="sm">
            <PlusIcon className="w-5 h-5" />
            Tambah Unit Pertama
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href="/admin/lessons/units/new">
          <Button variant="success" size="sm">
            <PlusIcon className="w-5 h-5" />
            Tambah Unit
          </Button>
        </Link>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleUnitDragEnd}
      >
        <SortableContext items={unitIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {units.map((unit) => (
              <SortableUnit
                key={unit.id}
                unit={unit}
                isExpanded={expandedUnits.has(unit.id)}
                onToggle={() => toggleUnit(unit.id)}
                onDelete={() => handleDeleteUnit(unit.id)}
                isLoading={loadingId === unit.id}
                expandedLessons={expandedLessons}
                onToggleLesson={toggleLesson}
                editingLesson={editingLesson}
                onEditLesson={setEditingLesson}
                addingLesson={addingLesson}
                onAddLesson={setAddingLesson}
                onDeleteLesson={(lessonId) => handleDeleteLesson(unit.id, lessonId)}
                onSaveLesson={handleSaveLesson}
                addingChallenge={addingChallenge}
                onAddChallenge={setAddingChallenge}
                onEditChallenge={setEditingChallenge}
                onDeleteChallenge={(lessonId, challengeId) =>
                  handleDeleteChallenge(unit.id, lessonId, challengeId)
                }
                onSaveChallenge={handleSaveChallenge}
                loadingId={loadingId}
                onReorderLessons={handleReorderLessons}
                onReorderChallenges={handleReorderChallenges}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editingChallenge && (
        <ChallengeForm
          lessonId={editingChallenge.lesson_id}
          challenge={editingChallenge}
          onClose={() => setEditingChallenge(null)}
          onSave={handleSaveChallenge}
        />
      )}
    </div>
  );
}
