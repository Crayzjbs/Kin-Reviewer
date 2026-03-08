export async function generateAnalogy(
  question: string,
  userAnswer: string,
  correctAnswer: string
): Promise<string> {
  const analogies = [
    `Think of it like this: ${question.toLowerCase()} is similar to how a traffic light works. Just as a red light means stop and green means go, ${correctAnswer} is the correct signal here, while ${userAnswer} would be like running a red light - it might seem like it could work, but it's not the right choice.`,
    
    `Imagine you're building a house. ${question} is like choosing the foundation. You thought ${userAnswer} would work, but ${correctAnswer} is actually the proper foundation - just like you can't build a house on sand when you need concrete, you need the right answer here.`,
    
    `Consider this like a recipe: ${question} asks for a specific ingredient. You suggested ${userAnswer}, but ${correctAnswer} is what the recipe actually calls for. Using the wrong ingredient might give you something edible, but it won't be the dish you're trying to make.`,
    
    `Think of it as a lock and key system. The question is the lock, and ${correctAnswer} is the key that fits perfectly. ${userAnswer} might look similar, but just like a key that's close but not exact won't open the door, it's not the right match.`,
    
    `Imagine you're navigating with a map. ${question} is asking for the correct route. You chose ${userAnswer}, which might be a road, but ${correctAnswer} is the actual path that gets you to your destination efficiently and safely.`,
  ];

  const randomIndex = Math.floor(Math.random() * analogies.length);
  return analogies[randomIndex];
}
