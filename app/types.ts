
export interface Need {
    id: number;
    title: string;
    description: string;
    category: 'Food' | 'Clothing' | 'Shelter' | 'Medical' | 'Education' | 'Other';
    priority: 'low' | 'medium' | 'high';
    timeSensitive: boolean;
    contactInfo: string;
    createdAt: string;
    amountDonated: number;
    amountNeeded: number;
    adminID: number;
}

export interface User {
    id: number;
    password: string;
    username: string;
    role: 'admin' | 'user';
    amountDonated: number;
    atoken?: string | null;
}

export interface Basket {
    basketID: number;
    needs: Array<Need>;
    userID: number;
}

export interface Cupboard {
    cupboardID: number;
    needs: Need[];
    adminID: number;
}

export interface BasketItem extends Need {
  donation: number;
}

export interface CommunityItem {
    id : number;
    title : string;
    description : string;
    category : Need['category'];
    volunteersNeeded : number;
    adminID : number;
    createdAt : string;
}

export interface StatsData {
    totalNeeds: number;
    totalNeeded: number;
    totalDonated: number;
    needsByCategory: {
      Food: number;
      Clothing: number;
      Shelter: number;
      Medical: number;
      Education: number;
      Other: number;
    };
  }