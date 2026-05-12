"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LessonForm } from "@/features/admin/components/LessonForm";
import { ChallengeForm } from "@/features/admin/components/ChallengeForm";
import {
  deleteUnit,
  deleteLesson,
  deleteChallenge,
} from "@/features/admin/actions";
import type { UnitWithLessons, Lesson, Challenge } from "@/types/database";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface LessonsPageClientProps {
  units: UnitWithLessons[];
}

export function LessonsPageClient({ units: initialUnits }: LessonsPageClientProps) {
  const [units, setUnits] = useState(initialUnits);
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(new Set());
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [addingLesson, setAddingLesson] = useState<string | null>(null);
  const [addingChallenge, setAddingChallenge] = useState<string | null>(null);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

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
    }
    setLoadingId(null);
  };

  const handleDeleteLesson = async (unitId: string, lessonId: string) => {
    if (!confirm("Yakin ingin menghapus lesson ini?")) return;
    setLoadingId(lessonId);
    const result = await deleteLesson(lessonId);
    if ("success" in result) {
      setUnits((prev) =>
        prev.map((u) =>
          u.id === unitId ? { ...u, lessons: u.lessons.filter((l) => l.id !== lessonId) } : u
        )
      );
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
    }
    setLoadingId(null);
  };

  const handleSaveChallenge = (_challenge: Challenge) => {
    window.location.reload();
  };

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

      {units.map((unit) => (
        <Card key={unit.id} padding="none" className="overflow-hidden">
          {/* Unit Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-border">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleUnit(unit.id)}
                className="p-1 text-muted hover:text-text transition-colors"
              >
                {expandedUnits.has(unit.id) ? (
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
                  onClick={() => handleDeleteUnit(unit.id)}
                  disabled={loadingId === unit.id}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Hapus unit"
                >
                  <TrashIcon className="w-4 h-4 text-hearts" />
                </button>
              </div>
            </div>
          </div>

          {/* Unit Body (expandable) */}
          {expandedUnits.has(unit.id) && (
            <div className="p-4 space-y-3">
              {/* Lessons */}
              {unit.lessons.map((lesson) => (
                <div key={lesson.id} className="bg-gray-50 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      onClick={() => toggleLesson(lesson.id)}
                      className="p-1 text-muted hover:text-text transition-colors shrink-0"
                    >
                      {expandedLessons.has(lesson.id) ? (
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
                        onClick={() => {
                          setEditingLesson(editingLesson === lesson.id ? null : lesson.id);
                          setAddingLesson(null);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Edit lesson"
                      >
                        <PencilIcon className="w-3.5 h-3.5 text-muted" />
                      </button>
                      <button
                        onClick={() => handleDeleteLesson(unit.id, lesson.id)}
                        disabled={loadingId === lesson.id}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus lesson"
                      >
                        <TrashIcon className="w-3.5 h-3.5 text-hearts" />
                      </button>
                    </div>
                  </div>

                  {/* Lesson edit form */}
                  {editingLesson === lesson.id && (
                    <div className="px-4 pb-4">
                      <LessonForm
                        unitId={unit.id}
                        lesson={lesson}
                        onSuccess={() => {
                          setEditingLesson(null);
                          window.location.reload();
                        }}
                        onCancel={() => setEditingLesson(null)}
                      />
                    </div>
                  )}

                  {/* Lesson challenges (expandable) */}
                  {expandedLessons.has(lesson.id) && (
                    <div className="px-4 pb-4">
                      <div className="space-y-2">
                        {(() => {
                          const challenges = (lesson as Lesson & { challenges?: Challenge[] }).challenges;
                          if (!challenges || challenges.length === 0) {
                            return (
                              <p className="text-sm text-muted text-center py-4">
                                Belum ada challenge
                              </p>
                            );
                          }
                          return challenges.map((challenge: Challenge, idx: number) => (
                            <div
                              key={challenge.id}
                              className="flex items-start gap-3 bg-white p-3 rounded-lg border border-border"
                            >
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
                                  <span className="text-xs text-muted">Q{idx + 1}</span>
                                </div>
                                <p className="text-sm font-medium text-text mb-2">
                                  {challenge.question}
                                </p>
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
                                  onClick={() => setEditingChallenge(challenge)}
                                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Edit challenge"
                                >
                                  <PencilIcon className="w-3.5 h-3.5 text-muted" />
                                </button>
                                <button
                                  onClick={() => handleDeleteChallenge(unit.id, lesson.id, challenge.id)}
                                  disabled={loadingId === challenge.id}
                                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Hapus challenge"
                                >
                                  <TrashIcon className="w-3.5 h-3.5 text-hearts" />
                                </button>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>

                      {addingChallenge === lesson.id ? (
                        <div className="mt-3">
                          <ChallengeForm
                            lessonId={lesson.id}
                            onClose={() => setAddingChallenge(null)}
                            onSave={handleSaveChallenge}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAddingChallenge(lesson.id);
                            setEditingChallenge(null);
                          }}
                          className="mt-3 flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Tambah Challenge
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Add Lesson */}
              {addingLesson === unit.id ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <LessonForm
                    unitId={unit.id}
                    onSuccess={() => {
                      setAddingLesson(null);
                      window.location.reload();
                    }}
                    onCancel={() => setAddingLesson(null)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAddingLesson(unit.id);
                    setEditingLesson(null);
                  }}
                  className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  <PlusIcon className="w-4 h-4" />
                  Tambah Lesson
                </button>
              )}
            </div>
          )}
        </Card>
      ))}

      {/* Edit Challenge Modal */}
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
