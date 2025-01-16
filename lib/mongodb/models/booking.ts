export interface Booking {
    _id?: string;
    userId: string;
    rentalId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
} 