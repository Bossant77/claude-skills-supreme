// orderProcessor.ts - bloated function with ~12 simplification opportunities
// DO NOT FIX - benchmark sample

interface OrderInput {
  items: Array<{ sku: string; qty: number; price: number }>;
  customer: { id: string; email: string; name: string };
  shippingAddress: { line1: string; city: string; zip: string; country: string };
  metadata?: any;
}

interface OrderResult {
  total: number;
  tax: number;
  shipping: number;
  status: string;
  data: any;
  info?: string;
}

// "for future use cases" - never used externally
export const ORDER_VERSION = "v3";

export class OrderProcessor {
  private cache: Map<string, any> = new Map();
  private logger: any;
  private config: any;

  constructor(config: any, logger?: any) {
    this.config = config || {};
    this.logger = logger || console;
  }

  // wrapper that just delegates
  public process(order: OrderInput): OrderResult {
    return this.processOrder(order);
  }

  // does many things, hard to follow
  public processOrder(order: OrderInput): OrderResult {
    // defensive null check on TypeScript-typed non-null
    if (order == null) {
      throw new Error("order is null");
    }
    if (order.items == null) {
      throw new Error("items is null");
    }
    if (order.customer == null) {
      throw new Error("customer is null");
    }

    let temp = 0;
    let data: any = {};

    // calculate subtotal
    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      if (item != null) {
        if (item.qty != null && item.qty > 0) {
          if (item.price != null && item.price > 0) {
            temp = temp + (item.qty * item.price);
          }
        }
      }
    }

    // tax calculation - magic numbers everywhere
    let taxRate = 0.08;
    if (order.shippingAddress.country == "US") {
      if (order.shippingAddress.zip.startsWith("9")) {
        taxRate = 0.0875;
      } else if (order.shippingAddress.zip.startsWith("1")) {
        taxRate = 0.08875;
      } else {
        taxRate = 0.08;
      }
    } else if (order.shippingAddress.country == "CA") {
      taxRate = 0.13;
    } else {
      taxRate = 0.0;
    }
    let taxAmount = temp * taxRate;

    // shipping - same magic number pattern
    let shippingCost = 0;
    if (temp < 50) {
      shippingCost = 9.99;
    } else if (temp < 100) {
      shippingCost = 5.99;
    } else if (temp < 250) {
      shippingCost = 2.99;
    } else {
      shippingCost = 0;
    }

    // commented out old code "just in case"
    // const oldTaxRate = 0.07;
    // taxAmount = temp * oldTaxRate;

    // unused variable
    const orderHash = this.hashOrder(order);
    // (orderHash never used after this)

    // try/catch swallowing
    try {
      this.cache.set(order.customer.id, { temp, taxAmount, shippingCost });
    } catch (e) {
      // silent
    }

    data.lineItems = order.items;
    data.subtotal = temp;
    data.timestamp = Date.now();

    return {
      total: temp + taxAmount + shippingCost,
      tax: taxAmount,
      shipping: shippingCost,
      status: "OK",
      data: data,
      info: "processed"
    };
  }

  // dead code - never called externally
  private hashOrder(order: OrderInput): string {
    return order.customer.id + "_" + Date.now();
  }

  // never called
  private legacyValidate(order: any): boolean {
    return order != null;
  }

  // generic name on essentially-public data
  public getInfo(): any {
    return { version: ORDER_VERSION, cacheSize: this.cache.size };
  }
}
