import { DatabaseService } from '../mongodb/utils';
import type { Rental } from '../mongodb/models/rental';

export const createRental = DatabaseService.createRental;
export const getRentals = DatabaseService.getRentals; 