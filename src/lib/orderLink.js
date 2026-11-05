// The order form, with one of our websites already chosen as the design the customer wants ("similar to").
export const orderUrl = (title) => (title ? `/confirm-order?website=${encodeURIComponent(title)}` : "/confirm-order");
