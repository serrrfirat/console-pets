import pet from './index.js';

async function runTests() {
console.log('🧪 Running Console Pets Tests...\n');

// Test all pets
console.log('Testing all pets:');
const pets = ['cat', 'dog', 'robot', 'dragon', 'hamster', 'alien'];

for (const petType of pets) {
  console.log(`\n✅ Testing ${petType}:`);
  await pet.happy(petType);
}

console.log('🎉 All tests passed!');
}

runTests().catch(console.error);