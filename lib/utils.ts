import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildQuery(searchParams: URLSearchParams) {
  const query: any = {}

  if (searchParams.get('destination')) {
    query.location = {
      $regex: searchParams.get('destination'),
      $options: 'i'
    }
  }
  if (searchParams.get('guests')) {
    query.maxGuests = {
      $gte: parseInt(searchParams.get('guests')!)
    }
  }
  // Add more query parameters as needed

  return query
}