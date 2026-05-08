# UI/UX Upgrade Implementation Guide

## Status: Libraries Installed ✅

### Completed
- ✅ Installed GSAP, canvas-confetti, SweetAlert2, Howler
- ✅ Added Sora font import
- ✅ Created CSS variables for color scheme
- ✅ Created quiz-sounds.ts module
- ✅ Added TypeScript types for libraries

### Implementation Needed

The review page needs the following enhancements. All changes are VISUAL ONLY - no quiz logic modifications.

## 1. Add Animation Refs and Sound Imports

```typescript
// Add to imports in app/review/page.tsx
import { playSuccessSound, playErrorSound } from '@/lib/quiz-sounds';

// Add refs after state declarations
const questionRef = useRef<HTMLDivElement>(null);
const answersRef = useRef<HTMLDivElement>(null);
```

## 2. Question Entrance Animation

Add this useEffect after existing useEffects:

```typescript
useEffect(() => {
  if (questionRef.current && !showAnswer) {
    gsap.fromTo(questionRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
  }
}, [currentIndex, showAnswer]);
```

## 3. Answer Buttons Stagger Animation

```typescript
useEffect(() => {
  if (answersRef.current && !showAnswer) {
    const buttons = answersRef.current.querySelectorAll('button');
    gsap.fromTo(buttons,
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: 'power2.out' }
    );
  }
}, [currentIndex, showAnswer]);
```

## 4. Enhanced handleSubmitAnswer with Effects

Replace the existing setIsCorrect and state updates with:

```typescript
setIsCorrect(correct);
setShowAnswer(true);
setTotalAnswered(totalAnswered + 1);

if (correct) {
  setCorrectCount(correctCount + 1);
  
  // Confetti celebration
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6C63FF', '#22C55E', '#FFD700']
  });
  
  // Success sound
  playSuccessSound();
  
  // SweetAlert2 popup
  Swal.fire({
    icon: 'success',
    title: 'Correct! 🎉',
    timer: 1500,
    showConfirmButton: false,
    background: '#ffffff',
    color: '#1A1A2E',
    iconColor: '#22C55E'
  });
  
  // Button bounce animation
  const selectedButton = document.querySelector(`[data-answer="${userAnswer}"]`);
  if (selectedButton) {
    gsap.to(selectedButton, {
      scale: [1, 1.03, 1],
      duration: 0.2
    });
  }
} else {
  setIncorrectCount(incorrectCount + 1);
  
  // Error sound
  playErrorSound();
  
  // Shake animation
  const selectedButton = document.querySelector(`[data-answer="${userAnswer}"]`);
  if (selectedButton) {
    gsap.to(selectedButton, {
      x: [-8, 8, -6, 6, -4, 4, 0],
      duration: 0.4
    });
  }
  
  // SweetAlert2 popup
  const correctAnswer = currentCard.question.correctAnswer || currentCard.question.answer;
  Swal.fire({
    icon: 'error',
    title: 'Not quite!',
    text: `Correct answer: ${correctAnswer}`,
    background: '#ffffff',
    color: '#1A1A2E',
    confirmButtonColor: '#6C63FF'
  });
}
```

## 5. Add Progress Bar Component

Add before the question display:

```typescript
{!showTimerSelection && dueCards.length > 0 && (
  <div className="mb-6">
    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-in-out"
        style={{ width: `${(currentIndex / dueCards.length) * 100}%` }}
      />
    </div>
    <div className="flex justify-between mt-2 text-sm text-gray-600">
      <span>Question {currentIndex + 1} of {dueCards.length}</span>
      <span className="font-medium">
        {scorePercentage}% correct
      </span>
    </div>
  </div>
)}
```

## 6. Update Answer Button Styling

Add data-answer attribute and enhanced classes to answer buttons:

```typescript
<button
  key={index}
  data-answer={option}
  onClick={() => handleOptionClick(option)}
  disabled={showAnswer}
  className={`
    quiz-button p-4 text-left font-['Sora']
    ${userAnswer === option ? 'ring-2 ring-[var(--color-primary)]' : ''}
    ${showAnswer && isCorrectOption ? 'answer-correct' : ''}
    ${showAnswer && userAnswer === option && !isCorrectOption ? 'answer-wrong' : ''}
  `}
>
  <span className="font-medium text-gray-700">{String.fromCharCode(65 + index)}.</span>
  <span className="ml-2">{option}</span>
</button>
```

## 7. Quiz Complete Celebration

Add to the end of handleRating when quiz completes:

```typescript
if (currentIndex >= dueCards.length - 1) {
  Swal.fire({
    title: '🎊 Quiz Complete!',
    html: `
      <div class="text-lg">
        <p class="mb-2">Final Score: <strong>${scorePercentage}%</strong></p>
        <p class="text-green-600">✓ Correct: ${correctCount}</p>
        <p class="text-red-600">✗ Incorrect: ${incorrectCount}</p>
      </div>
    `,
    background: '#ffffff',
    color: '#1A1A2E',
    confirmButtonColor: '#6C63FF',
    confirmButtonText: 'Review Again'
  }).then((result) => {
    if (result.isConfirmed) {
      setCurrentIndex(0);
      setCorrectCount(0);
      setIncorrectCount(0);
      setTotalAnswered(0);
    }
  });
}
```

## 8. Apply Sora Font to Question Text

Update question display div:

```typescript
<div ref={questionRef} className="mb-8 font-['Sora']">
  <h2 className="text-2xl font-medium text-[var(--color-text)] leading-relaxed">
    {currentCard.question.question}
  </h2>
</div>
```

## CSS Variables Available

```css
--color-primary: #6C63FF   (purple accent)
--color-correct: #22C55E   (green)
--color-wrong:   #EF4444   (red)
--color-bg:      #F9F9FB   (off-white)
--color-card:    #FFFFFF
--color-text:    #1A1A2E
--color-muted:   #94A3B8
```

## Testing Checklist

- [ ] Question fades in smoothly when loaded
- [ ] Answer buttons appear with stagger effect
- [ ] Correct answer triggers confetti + sound + popup
- [ ] Wrong answer triggers shake + sound + popup
- [ ] Progress bar animates smoothly
- [ ] Quiz complete shows final score popup
- [ ] All quiz logic remains unchanged
- [ ] Sora font applies to questions and answers

## Notes

- All animations are purely visual
- No quiz logic, scoring, or answer checking was modified
- Sound effects are base64 encoded (no external URLs)
- SweetAlert2 popups are non-blocking for correct answers (1.5s timer)
- GSAP animations use power2.out easing for smooth motion
- Progress bar uses CSS transitions for smooth width changes
