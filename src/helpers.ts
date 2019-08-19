export const iconFromCategory = (category: Expense['category']): string => {
  switch (category) {
    case 'Groceries':
      return 'local_grocery_store';
    case 'Restaurants':
      return 'local_dining';
    case 'Car':
      return 'directions_car';
    case 'Hobbies':
      return 'local_library';
    case 'Household':
      return 'home';
    case 'Shopping':
      return 'local_mall';
    case 'Health':
      return 'local_hospital';
    case 'Entertainment':
      return 'local_movies';
    case 'Tech':
      return 'important_devices';
    case 'Taxi':
      return 'local_taxi';
    case 'Education':
      return 'school';
    default:
      return 'attach_money';
  }
};
