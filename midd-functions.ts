function areSetsEqual<T>(setA: Set<T>, setB: Set<T>): string | string[] {
    const unequal : string[] = [];
    // Check every element in setA to see if it exists in setB
    for (let a of setA) {
      if (!setB.has(a)) {
        unequal.push(a as string); // If an element in setA is not in setB, sets are not equal
      }
    }

    if (unequal.length === 0) return 'YES';
    return unequal;
}