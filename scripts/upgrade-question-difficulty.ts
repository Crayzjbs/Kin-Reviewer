import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface RawQuestion {
  id: number;
  topic: string;
  question: string;
  choices: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer_letter: string;
  answer: string;
}

// Architecture-specific knowledge base for generating plausible distractors
const architectureKnowledge = {
  'History of Architecture': {
    egyptianPharaohs: ['Rameses I', 'Rameses II', 'Seti I', 'Tutankhamun', 'Khufu', 'Khafre', 'Menkaure', 'Hatshepsut', 'Akhenaten', 'Horemheb'],
    greekArchitects: ['Ictinus', 'Callicrates', 'Phidias', 'Hippodamus', 'Mnesicles', 'Polykleitos'],
    romanArchitects: ['Vitruvius', 'Apollodorus of Damascus', 'Rabirius'],
    renaissanceArchitects: ['Filippo Brunelleschi', 'Leon Battista Alberti', 'Donato Bramante', 'Michelangelo', 'Andrea Palladio'],
    materials: ['Marble', 'Limestone', 'Granite', 'Travertine', 'Sandstone', 'Basalt', 'Alabaster'],
    architecturalElements: ['Tympanum', 'Pediment', 'Frieze', 'Architrave', 'Cornice', 'Metope', 'Triglyph', 'Dentil', 'Volute']
  },
  'Structural': {
    beamTypes: ['Simply supported beam', 'Cantilever beam', 'Continuous beam', 'Fixed beam', 'Overhanging beam'],
    loadTypes: ['Dead load', 'Live load', 'Wind load', 'Seismic load', 'Snow load', 'Impact load'],
    materials: ['Reinforced concrete', 'Structural steel', 'Prestressed concrete', 'Timber', 'Composite'],
    stressTypes: ['Tensile stress', 'Compressive stress', 'Shear stress', 'Bending stress', 'Torsional stress']
  },
  'Electrical': {
    conduitTypes: ['EMT conduit', 'Rigid metal conduit', 'PVC conduit', 'Flexible metal conduit', 'Liquidtight conduit'],
    wireGauges: ['14 AWG', '12 AWG', '10 AWG', '8 AWG', '6 AWG', '4 AWG'],
    voltages: ['110V', '220V', '230V', '240V', '380V', '440V'],
    protectionDevices: ['Circuit breaker', 'Fuse', 'GFCI', 'AFCI', 'Surge protector']
  },
  'Plumbing': {
    pipeTypes: ['PVC pipe', 'CPVC pipe', 'Copper pipe', 'PEX pipe', 'Galvanized steel pipe', 'Cast iron pipe'],
    fittings: ['Elbow', 'Tee', 'Coupling', 'Union', 'Reducer', 'Cap', 'Plug'],
    fixtures: ['Water closet', 'Lavatory', 'Sink', 'Urinal', 'Bidet', 'Shower'],
    valves: ['Gate valve', 'Globe valve', 'Ball valve', 'Check valve', 'Butterfly valve']
  },
  'Mechanical': {
    hvacSystems: ['Split-type AC', 'Central AC', 'VRF system', 'Chilled water system', 'Package unit'],
    ductTypes: ['Rectangular duct', 'Round duct', 'Flexible duct', 'Spiral duct'],
    refrigerants: ['R-410A', 'R-32', 'R-134a', 'R-22', 'R-407C']
  }
};

// Generate plausible numerical distractors
function generateNumericalDistractors(correctValue: string): string[] {
  const match = correctValue.match(/^([\d.]+)\s*(.*)$/);
  if (!match) return [];
  
  const num = parseFloat(match[1]);
  const unit = match[2];
  
  if (isNaN(num)) return [];
  
  const distractors: string[] = [];
  
  // Decimal point errors
  distractors.push(`${(num * 10).toFixed(2)} ${unit}`.trim());
  distractors.push(`${(num / 10).toFixed(2)} ${unit}`.trim());
  
  // Calculation errors (common mistakes)
  distractors.push(`${(num * 2).toFixed(2)} ${unit}`.trim());
  distractors.push(`${(num / 2).toFixed(2)} ${unit}`.trim());
  
  // Off-by-one or similar
  distractors.push(`${(num + (num * 0.1)).toFixed(2)} ${unit}`.trim());
  distractors.push(`${(num - (num * 0.1)).toFixed(2)} ${unit}`.trim());
  
  // Digit reversal for two-digit numbers
  const numStr = num.toString();
  if (numStr.length === 2 && !numStr.includes('.')) {
    const reversed = numStr.split('').reverse().join('');
    distractors.push(`${reversed} ${unit}`.trim());
  }
  
  return distractors.filter(d => d !== correctValue);
}

// Check if answer is numerical
function isNumerical(answer: string): boolean {
  return /^\d+\.?\d*\s*[a-zA-Z]*$/.test(answer.trim());
}

// Get related terms from knowledge base
function getRelatedTerms(topic: string, correctAnswer: string): string[] {
  const topicKey = topic as keyof typeof architectureKnowledge;
  const topicKnowledge = architectureKnowledge[topicKey];
  
  if (!topicKnowledge) return [];
  
  const allTerms: string[] = [];
  Object.values(topicKnowledge).forEach(category => {
    if (Array.isArray(category)) {
      allTerms.push(...category);
    }
  });
  
  // Filter out the correct answer and return related terms
  return allTerms.filter(term => 
    term.toLowerCase() !== correctAnswer.toLowerCase() &&
    !correctAnswer.toLowerCase().includes(term.toLowerCase())
  );
}

// Improve distractors for a single question
function improveDistractors(question: RawQuestion): { A: string; B: string; C: string; D: string } {
  const correctAnswer = question.answer;
  const correctLetter = question.answer_letter;
  const currentChoices = question.choices;
  
  // If it's numerical, use numerical distractor generation
  if (isNumerical(correctAnswer)) {
    const numericalDistractors = generateNumericalDistractors(correctAnswer);
    const newChoices: any = {};
    
    let distractorIndex = 0;
    ['A', 'B', 'C', 'D'].forEach(letter => {
      if (letter === correctLetter) {
        newChoices[letter] = correctAnswer;
      } else {
        newChoices[letter] = numericalDistractors[distractorIndex] || currentChoices[letter as keyof typeof currentChoices];
        distractorIndex++;
      }
    });
    
    return newChoices;
  }
  
  // For conceptual questions, use knowledge base
  const relatedTerms = getRelatedTerms(question.topic, correctAnswer);
  
  if (relatedTerms.length >= 3) {
    // Shuffle and pick 3 related terms
    const shuffled = relatedTerms.sort(() => Math.random() - 0.5);
    const selectedDistractors = shuffled.slice(0, 3);
    
    const newChoices: any = {};
    let distractorIndex = 0;
    
    ['A', 'B', 'C', 'D'].forEach(letter => {
      if (letter === correctLetter) {
        newChoices[letter] = correctAnswer;
      } else {
        newChoices[letter] = selectedDistractors[distractorIndex];
        distractorIndex++;
      }
    });
    
    return newChoices;
  }
  
  // If we can't improve, keep original but mark for manual review
  return currentChoices;
}

async function upgradeQuestions() {
  console.log('Starting question difficulty upgrade...\n');
  
  const jsonPath = path.join(__dirname, '../app/topicjson/STANDARDS_CODE_REVIEWER.json');
  const rawData: RawQuestion[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  
  console.log(`Loaded ${rawData.length} questions`);
  console.log('Analyzing and upgrading difficulty...\n');
  
  const upgradedQuestions: any[] = [];
  let improvedCount = 0;
  let needsManualReview = 0;
  
  for (const question of rawData) {
    const improvedChoices = improveDistractors(question);
    
    // Check if we actually improved it
    const originalDistractors = Object.values(question.choices).filter(c => c !== question.answer);
    const newDistractors = Object.values(improvedChoices).filter(c => c !== question.answer);
    
    const wasImproved = JSON.stringify(originalDistractors) !== JSON.stringify(newDistractors);
    
    if (wasImproved) {
      improvedCount++;
    } else {
      needsManualReview++;
    }
    
    upgradedQuestions.push({
      ...question,
      choices: improvedChoices,
      difficulty_upgraded: wasImproved
    });
  }
  
  console.log(`\n--- Upgrade Analysis ---`);
  console.log(`Total questions: ${rawData.length}`);
  console.log(`Automatically improved: ${improvedCount}`);
  console.log(`Needs manual review: ${needsManualReview}`);
  
  // Save upgraded questions to new file
  const outputPath = path.join(__dirname, '../app/topicjson/STANDARDS_CODE_REVIEWER_UPGRADED.json');
  fs.writeFileSync(outputPath, JSON.stringify(upgradedQuestions, null, 2));
  
  console.log(`\n✓ Upgraded questions saved to: STANDARDS_CODE_REVIEWER_UPGRADED.json`);
  console.log('\nNext steps:');
  console.log('1. Review the upgraded questions');
  console.log('2. Manually improve questions marked for review');
  console.log('3. Run import script to update database');
  
  return upgradedQuestions;
}

upgradeQuestions().catch(console.error);
