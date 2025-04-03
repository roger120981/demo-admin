export const callTypes = new Map<boolean, string>([
    [true, 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
    [false, 'bg-neutral-300/40 border-neutral-300'],
  ]);
  
  export const genderOptions = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    { label: 'Other', value: 'O' },
  ];
  
  export const booleanOptions = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false },
  ];