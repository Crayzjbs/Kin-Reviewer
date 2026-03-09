# Board Exam Difficulty Guide

## Overview
This guide explains how to create Philippine Architecture Licensure Examination (ALE) level questions with appropriate difficulty. All questions should be challenging enough to prepare students for the actual board exam.

## Question Difficulty Standards

### 1. Multiple Choice Questions

#### ❌ BAD EXAMPLE (Too Easy)
```
Question: What is the primary purpose of a foundation?
A. To make the building look nice
B. To support the building structure
C. To provide ventilation
D. To store water

Correct Answer: B
```
**Problem**: The correct answer is too obvious. Other choices are completely unrelated.

#### ✅ GOOD EXAMPLE (Board Exam Level)
```
Question: According to the National Building Code, what is the minimum depth of foundation footing for a two-story residential building on medium-density soil?
A. 0.60 meters below natural grade
B. 0.80 meters below natural grade
C. 1.00 meters below natural grade
D. 1.20 meters below natural grade

Correct Answer: C
```
**Why it's better**: All options are plausible depths. Requires knowledge of specific code requirements.

### 2. Numerical Questions

#### ❌ BAD EXAMPLE (Too Easy)
```
Question: If a beam is 10 meters long, what is half its length?
A. 5 meters
B. 100 meters
C. 2 meters
D. 50 meters

Correct Answer: A
```
**Problem**: Simple arithmetic. Distractors are obviously wrong.

#### ✅ GOOD EXAMPLE (Board Exam Level)
```
Question: A reinforced concrete beam has a clear span of 6.5 meters and supports a uniform dead load of 12 kN/m and live load of 8 kN/m. What is the maximum bending moment at midspan?
A. 105.625 kN·m
B. 106.625 kN·m
C. 10.5625 kN·m
D. 1056.25 kN·m

Correct Answer: A
```
**Why it's better**: 
- Requires calculation: M = (wL²)/8 where w = 12+8 = 20 kN/m, L = 6.5m
- Distractors include decimal point errors (C, D) and calculation mistakes (B)
- All answers look plausible at first glance

### 3. True/False Questions

#### ❌ BAD EXAMPLE (Too Easy)
```
Question: True or false, 60° branches or offsets may be used only when installed in a true vertical position.
A. True
B. False
C. Maybe
D. Sometimes

Correct Answer: A
```
**Problem**: Options C and D are nonsensical. Only one reasonable answer.

#### ✅ GOOD EXAMPLE (Board Exam Level)
```
Question: According to the Philippine Electrical Code, a 60° branch or offset in conduit installation is permitted in vertical runs but requires additional support within 900mm of the fitting.
A. True - 60° fittings are allowed in vertical runs with support within 900mm
B. False - 60° fittings require support within 600mm, not 900mm
C. False - 60° fittings are only permitted in horizontal runs
D. False - 60° fittings are prohibited in all conduit installations

Correct Answer: A
```
**Why it's better**: All options are technically worded and require specific code knowledge to differentiate.

### 4. Conceptual Questions

#### ❌ BAD EXAMPLE (Too Easy)
```
Question: What does HVAC stand for?
A. Heating, Ventilation, and Air Conditioning
B. Heavy Vehicle Access Control
C. High Voltage Alternating Current
D. House Value Assessment Code

Correct Answer: A
```
**Problem**: Only one option makes sense in architectural context.

#### ✅ GOOD EXAMPLE (Board Exam Level)
```
Question: In HVAC system design, which factor has the MOST significant impact on cooling load calculation for a west-facing office space in Manila?
A. Solar heat gain through glazing during afternoon hours
B. Internal heat gain from occupants and equipment
C. Infiltration through building envelope
D. Conduction through exterior walls

Correct Answer: A
```
**Why it's better**: All factors affect cooling load. Requires understanding of Philippine climate and building orientation principles.

## Creating Effective Distractors

### Rules for Wrong Answers:
1. **Use real terminology** - Don't make up fake terms
2. **Create plausible confusion** - Use similar numbers, concepts, or codes
3. **Include common mistakes** - Calculation errors, unit conversions, decimal placement
4. **Test related knowledge** - Use concepts from the same topic area

### Numerical Distractor Patterns:
If correct answer is **35.5**, use:
- **355.5** (decimal point error)
- **3.55** (decimal point error opposite direction)
- **53.5** (digit reversal)
- **35.05** (similar but wrong calculation)

NOT: 100, 5, 1000 (completely unrelated numbers)

### Conceptual Distractor Patterns:
If correct answer is **"Rameses I"**, use:
- **Rameses II** (related historical figure)
- **Seti I** (same dynasty)
- **Tutankhamun** (same era, different dynasty)

NOT: "George Washington", "Napoleon", "Mao Zedong" (completely different context)

## Code-Based Questions

### Requirements:
1. **Cite specific codes**: National Building Code, Philippine Electrical Code, Plumbing Code
2. **Use exact measurements**: Don't round unless specified
3. **Include proper units**: meters, millimeters, kN, MPa, etc.
4. **Reference specific sections**: "According to Section 704 of the NBC..."

### Example:
```
Question: Per Section 1207 of the National Building Code of the Philippines, what is the minimum ceiling height for habitable rooms?
A. 2.40 meters
B. 2.70 meters
C. 3.00 meters
D. 2.50 meters

Correct Answer: B
```

## Difficulty Levels

### Easy (20% of questions)
- Direct code references
- Basic definitions with technical distractors
- Simple calculations with unit conversion traps

### Medium (50% of questions)
- Multi-step calculations
- Code interpretation and application
- Comparison of similar concepts

### Hard (30% of questions)
- Complex problem-solving
- Integration of multiple code sections
- Advanced calculations with multiple variables
- Scenario-based questions requiring analysis

## Quality Checklist

Before finalizing a question, verify:
- [ ] All distractors are plausible and use real terminology
- [ ] Correct answer is definitively correct per code/standard
- [ ] Question tests actual board exam competency
- [ ] No distractor is obviously wrong
- [ ] Numerical distractors follow error patterns (not random)
- [ ] Question difficulty matches intended level
- [ ] Proper units and measurements are used
- [ ] Code references are accurate and specific

## Example Question Set (Architecture - Structural)

```json
{
  "question": "A simply supported beam with a span of 8 meters carries a uniformly distributed load of 15 kN/m. What is the maximum shear force?",
  "choices": {
    "A": "60 kN",
    "B": "120 kN", 
    "C": "30 kN",
    "D": "240 kN"
  },
  "answer_letter": "A",
  "answer": "60 kN",
  "explanation": "For a simply supported beam with UDL, maximum shear = wL/2 = (15 × 8)/2 = 60 kN. This occurs at the supports."
}
```

**Distractor Analysis:**
- B (120 kN): Student forgot to divide by 2
- C (30 kN): Student used L/4 instead of L/2
- D (240 kN): Student multiplied instead of dividing

All distractors represent common calculation errors, making them plausible.
