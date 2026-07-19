import { useState, useRef, useCallback, type ChangeEvent, type DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { jobApi } from '@/lib/jobApi';

// ─── Layout constants ─────────────────────────────────────────────────────────

const TILE = 28;
const TILE_GAP = 2;
const FACE_GAP = 4;
const FACE_SIZE = 3 * TILE + 2 * TILE_GAP;
const L_OFFSET = FACE_SIZE + FACE_GAP;

// ─── Face definitions ─────────────────────────────────────────────────────────

const FACES = {
  top:    { letter: 'U', label: 'Up',    faceColor: '#f0f0f0', textColor: '#111', hint: 'Back edge at top of photo' },
  left:   { letter: 'L', label: 'Left',  faceColor: '#ff5800', textColor: '#fff', hint: 'Green (front) edge on right' },
  front:  { letter: 'F', label: 'Front', faceColor: '#009b48', textColor: '#fff', hint: 'Straight on, top edge at top' },
  right:  { letter: 'R', label: 'Right', faceColor: '#b71234', textColor: '#fff', hint: 'Green (front) edge on left' },
  back:   { letter: 'B', label: 'Back',  faceColor: '#0046ad', textColor: '#fff', hint: "From behind — cube's right on your left" },
  bottom: { letter: 'D', label: 'Down',  faceColor: '#ffd500', textColor: '#111', hint: 'Front edge at top of photo' },
} as const;

type FaceKey = keyof typeof FACES;

const MIDDLE_ROW: FaceKey[] = ['left', 'front', 'right', 'back'];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubmitPage() {
  const navigate = useNavigate();

  const [previews, setPreviews] = useState<Partial<Record<FaceKey, string>>>({});
  const [files, setFiles] = useState<Partial<Record<FaceKey, File>>>({});
  const [dragOver, setDragOver] = useState<FaceKey | null>(null);

  const inputRefs = useRef<Partial<Record<FaceKey, HTMLInputElement>>>({});
  const allFacesSelected = Object.keys(files).length === 6;

  const { mutate: submitJob, isPending, error } = useMutation({
    mutationFn: async () => {
      const contentTypes = Object.fromEntries(
        (Object.entries(files) as [FaceKey, File][]).map(([face, file]) => [face, file.type])
      );
      const { jobId, presignedUrls } = await jobApi.createJob(contentTypes);
      await Promise.all(
        (Object.entries(files) as [FaceKey, File][]).map(([face, file]) =>
          jobApi.uploadFaceImage(presignedUrls[face], file)
        )
      );
      return jobId;
    },
    onSuccess: (jobId) => {
      navigate(`/jobs/${jobId}`);
    },
  });

  // ── File handling ────────────────────────────────────────────────────────

  const setFaceFile = useCallback((face: FaceKey, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => ({ ...prev, [face]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
    setFiles((prev) => ({ ...prev, [face]: file }));
  }, []);

  function handleFileInput(face: FaceKey, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setFaceFile(face, file);
  }

  function handleDrop(face: FaceKey, e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) setFaceFile(face, file);
  }

  function removeFace(face: FaceKey) {
    setPreviews((prev) => { const n = { ...prev }; delete n[face]; return n; });
    setFiles((prev) => { const n = { ...prev }; delete n[face]; return n; });
    if (inputRefs.current[face]) inputRefs.current[face]!.value = '';
  }

  // ── Face slot renderer ───────────────────────────────────────────────────

  function renderFaceSlot(key: FaceKey) {
    const { letter, label, faceColor, textColor, hint } = FACES[key];
    const preview = previews[key];
    const isDragTarget = dragOver === key;

    return (
      <div key={key} className="flex flex-col items-center gap-1">
        <div
          role="button"
          tabIndex={0}
          aria-label={
            preview
              ? `${label} face photo uploaded. Activate to replace.`
              : `Upload ${label} face photo. ${hint}`
          }
          className={cn(
            'relative cursor-pointer overflow-hidden transition-opacity hover:opacity-80',
            isDragTarget && 'ring-2 ring-primary ring-offset-1 ring-offset-background'
          )}
          style={{
            width: FACE_SIZE,
            height: FACE_SIZE,
            borderRadius: 4,
            ...(preview ? { outline: `2px solid ${faceColor}` } : {}),
          }}
          onClick={() => inputRefs.current[key]?.click()}
          onKeyDown={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRefs.current[key]?.click();
            }
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(key); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => handleDrop(key, e)}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt={`${label} face`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-0.5 top-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 transition-colors hover:bg-black/80"
                onClick={(e) => { e.stopPropagation(); removeFace(key); }}
                aria-label={`Remove ${label} face`}
              >
                <X className="h-2.5 w-2.5 text-white" />
              </button>
            </>
          ) : (
            <div
              className="h-full w-full"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(3, ${TILE}px)`,
                gridTemplateRows: `repeat(3, ${TILE}px)`,
                gap: TILE_GAP,
                padding: TILE_GAP,
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ backgroundColor: '#e4e4e7', borderRadius: 2 }} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span
            className="flex h-4 w-4 items-center justify-center rounded text-[10px] font-bold"
            style={{ backgroundColor: faceColor, color: textColor }}
          >
            {letter}
          </span>
          <span className="text-[11px] text-muted-foreground">{label}</span>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Rubik&apos;s Cube Solver
        </h1>
        <p className="mt-1 text-sm text-muted">
          Upload one photo per face. We&apos;ll analyse the colours and compute an optimal solution.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-4">
        <p className="mb-2 text-sm font-medium text-foreground">Tips for best results</p>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted">
          <li>Photograph each face straight-on — not at an angle</li>
          <li>Make sure all 9 stickers are fully visible</li>
          <li>Use good lighting — avoid shadows or glare</li>
          <li>Keep the cube stable so colours are crisp and unblurred</li>
        </ul>
      </div>

      <div className="flex flex-col gap-6">
        {/* Cube net */}
        <div className="overflow-x-auto pb-1">
          <div className="flex flex-col" style={{ gap: FACE_GAP }}>
            <div className="flex" style={{ marginLeft: L_OFFSET }}>
              {renderFaceSlot('top')}
            </div>
            <div className="flex" style={{ gap: FACE_GAP }}>
              {MIDDLE_ROW.map(renderFaceSlot)}
            </div>
            <div className="flex" style={{ marginLeft: L_OFFSET }}>
              {renderFaceSlot('bottom')}
            </div>
          </div>
        </div>

        {/* Orientation guide */}
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Photo orientation guide
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {(Object.entries(FACES) as [FaceKey, (typeof FACES)[FaceKey]][]).map(
              ([key, { letter, faceColor, textColor, hint }]) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-[10px] font-bold"
                    style={{ backgroundColor: faceColor, color: textColor }}
                  >
                    {letter}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{hint}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="h-1.5 flex-1 rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(Object.keys(files).length / 6) * 100}%` }}
            />
          </div>
          <span className="tabular-nums text-sm text-muted">
            {Object.keys(files).length}/6 faces
          </span>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {error instanceof Error ? error.message : 'Failed to submit. Please try again.'}
          </p>
        )}

        <Button
          size="lg"
          disabled={!allFacesSelected || isPending}
          onClick={() => submitJob()}
          className="w-full sm:w-auto"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {isPending ? 'Submitting…' : 'Solve my cube'}
        </Button>

        {!allFacesSelected && (
          <p className="text-xs text-muted-foreground">
            All 6 faces must be uploaded before submitting.
          </p>
        )}

        {/* Hidden file inputs */}
        {(Object.keys(FACES) as FaceKey[]).map((key) => (
          <input
            key={key}
            ref={(el) => { if (el) inputRefs.current[key] = el; }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileInput(key, e)}
          />
        ))}
      </div>
    </div>
  );
}
