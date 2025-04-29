import React from 'react';
import StatesList from '@/components/StatesList'; // Assuming StatesList is in components

// Mock function to get lottery data for a state - replace with actual data fetching/filtering
const getLotteriesForState = (stateAbbr: string) => {
  // In a real app, fetch data based on stateAbbr
  // For now, return mock data or indicate state
  console.log(`Fetching lotteries for state: ${stateAbbr.toUpperCase()}`);
  // Example: Filter a larger dataset or call an API
  if (stateAbbr === 'ca') {
    return [{ name: 'California Daily 3 Midday', logo: '/logos/placeholder-logo.svg' }]; // Example
  }
  return [];
};

interface StatePageProps {
  params: { sigla: string };
  searchParams: { [key: string]: string | string[] | undefined }; // Add searchParams
}

const StatePage = async ({ params }: StatePageProps) => {
  const { sigla } = params;
  const stateLotteries = getLotteriesForState(sigla);

  // Find the full state name (optional, but good for display)
  // You might want to move usStates array to a shared utility file
  const usStates = [
    { name: 'Alabama', abbr: 'AL' }, { name: 'Alaska', abbr: 'AK' }, { name: 'Arizona', abbr: 'AZ' }, 
    { name: 'Arkansas', abbr: 'AR' }, { name: 'California', abbr: 'CA' }, { name: 'Colorado', abbr: 'CO' },
    { name: 'Connecticut', abbr: 'CT' }, { name: 'Delaware', abbr: 'DE' }, { name: 'District of Columbia', abbr: 'DC' },
    { name: 'Florida', abbr: 'FL' }, { name: 'Georgia', abbr: 'GA' }, { name: 'Hawaii', abbr: 'HI' },
    { name: 'Idaho', abbr: 'ID' }, { name: 'Illinois', abbr: 'IL' }, { name: 'Indiana', abbr: 'IN' },
    { name: 'Iowa', abbr: 'IA' }, { name: 'Kansas', abbr: 'KS' }, { name: 'Kentucky', abbr: 'KY' },
    { name: 'Louisiana', abbr: 'LA' }, { name: 'Maine', abbr: 'ME' }, { name: 'Maryland', abbr: 'MD' },
    { name: 'Massachusetts', abbr: 'MA' }, { name: 'Michigan', abbr: 'MI' }, { name: 'Minnesota', abbr: 'MN' },
    { name: 'Mississippi', abbr: 'MS' }, { name: 'Missouri', abbr: 'MO' }, { name: 'Montana', abbr: 'MT' },
    { name: 'Nebraska', abbr: 'NE' }, { name: 'Nevada', abbr: 'NV' }, { name: 'New Hampshire', abbr: 'NH' },
    { name: 'New Jersey', abbr: 'NJ' }, { name: 'New Mexico', abbr: 'NM' }, { name: 'New York', abbr: 'NY' },
    { name: 'North Carolina', abbr: 'NC' }, { name: 'North Dakota', abbr: 'ND' }, { name: 'Ohio', abbr: 'OH' },
    { name: 'Oklahoma', abbr: 'OK' }, { name: 'Oregon', abbr: 'OR' }, { name: 'Pennsylvania', abbr: 'PA' },
    { name: 'Rhode Island', abbr: 'RI' }, { name: 'South Carolina', abbr: 'SC' }, { name: 'South Dakota', abbr: 'SD' },
    { name: 'Tennessee', abbr: 'TN' }, { name: 'Texas', abbr: 'TX' }, { name: 'Utah', abbr: 'UT' },
    { name: 'Vermont', abbr: 'VT' }, { name: 'Virginia', abbr: 'VA' }, { name: 'Washington', abbr: 'WA' },
    { name: 'West Virginia', abbr: 'WV' }, { name: 'Wisconsin', abbr: 'WI' }, { name: 'Wyoming', abbr: 'WY' },
  ];
  const currentState = usStates.find(state => state.abbr.toLowerCase() === sigla.toLowerCase());

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Loterias de {currentState ? currentState.name : sigla.toUpperCase()}</h1>
      
      {/* Placeholder for state-specific lottery content */}
      {stateLotteries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stateLotteries.map(lottery => (
            <div key={lottery.name} className="bg-card text-card-foreground p-4 rounded-lg shadow-md">
              {/* Display lottery info here - adapt card layout later */}
              <h3 className="font-bold text-lg mb-2">{lottery.name}</h3>
              {/* Add more details and link */} 
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhuma loteria específica encontrada para este estado (ainda!).</p>
      )}

      {/* Optionally, display the full list of states again for navigation */}
      {/* <div className="mt-12">
        <StatesList />
      </div> */}
    </div>
  );
};

export default StatePage;

