export interface ProductMasterData {
  productCategory: string;
  productSubCategory: string;
  productSubtype: string;
  partnerSkuUniqueCode: string;
  modelNumber: string;
  gtinUpc: string;
  brand: string;
  productTitle: string;
  colourName: string;
  setIncludes: string;
  featureBullet1: string;
  featureBullet2: string;
  featureBullet3: string;
  featureBullet4: string;
  featureBullet5: string;
  whatIsInTheBox: string;
  longDescription: string;
  countryOfOrigin: string;
  colourFamily: string;
  size: string;
  sizeUnit: string;
  secondaryMaterial: string;
  materialFinish: string;
  careInstructions: string;
  itemCondition: string;
  grade: string;
  productLength: string;
  productLengthUnit: string;
  productHeight: string;
  productHeightUnit: string;
  productWidthDepth: string;
  productWidthDepthUnit: string;
  productWeight: string;
  productWeightUnit: string;
  numberOfPieces: string;
  shippingLength: string;
  shippingLengthUnit: string;
  shippingHeight: string;
  shippingHeightUnit: string;
  shippingWidthDepth: string;
  shippingWidthDepthUnit: string;
  shippingWeight: string;
  shippingWeightUnit: string;
  recommendedRetailPrice: string;
  recommendedRetailPriceAEUnit: string;
  hsCode: string;
}

export type ProductMasterFieldType = "text" | "number" | "textarea" | "select";

export interface ProductMasterField {
  key: keyof ProductMasterData;
  label: string;
  type?: ProductMasterFieldType;
  placeholder?: string;
  helper?: string;
  rows?: number;
  options?: string[];
}

export interface ProductMasterGroup {
  title: string;
  fields: ProductMasterField[];
}

export const EMPTY_PRODUCT_MASTER_DATA: ProductMasterData = {
  productCategory: "",
  productSubCategory: "",
  productSubtype: "",
  partnerSkuUniqueCode: "",
  modelNumber: "",
  gtinUpc: "",
  brand: "",
  productTitle: "",
  colourName: "",
  setIncludes: "",
  featureBullet1: "",
  featureBullet2: "",
  featureBullet3: "",
  featureBullet4: "",
  featureBullet5: "",
  whatIsInTheBox: "",
  longDescription: "",
  countryOfOrigin: "",
  colourFamily: "",
  size: "",
  sizeUnit: "",
  secondaryMaterial: "",
  materialFinish: "",
  careInstructions: "",
  itemCondition: "",
  grade: "",
  productLength: "",
  productLengthUnit: "",
  productHeight: "",
  productHeightUnit: "",
  productWidthDepth: "",
  productWidthDepthUnit: "",
  productWeight: "",
  productWeightUnit: "",
  numberOfPieces: "",
  shippingLength: "",
  shippingLengthUnit: "",
  shippingHeight: "",
  shippingHeightUnit: "",
  shippingWidthDepth: "",
  shippingWidthDepthUnit: "",
  shippingWeight: "",
  shippingWeightUnit: "",
  recommendedRetailPrice: "",
  recommendedRetailPriceAEUnit: "",
  hsCode: "",
};

const LENGTH_UNITS = ["mm", "cm", "m", "in", "ft"];
const WEIGHT_UNITS = ["g", "kg", "lb", "oz"];
const CURRENCY_UNITS = ["AED", "USD", "EUR", "GBP", "INR"];

export const PRODUCT_MASTER_GROUPS: ProductMasterGroup[] = [
  {
    title: "Catalog Details",
    fields: [
      { key: "productSubCategory", label: "Product SubCategory" },
      { key: "productSubtype", label: "Product Subtype" },
      { key: "partnerSkuUniqueCode", label: "Partner SKU Unique Code" },
      { key: "modelNumber", label: "Model Number" },
      { key: "gtinUpc", label: "GTIN/UPC (if Available)" },
      { key: "brand", label: "Brand" },
      { key: "productTitle", label: "Product Title" },
      { key: "colourName", label: "Colour Name" },
      { key: "colourFamily", label: "Colour Family" },
      { key: "setIncludes", label: "Set Includes" },
      { key: "countryOfOrigin", label: "Country of Origin" },
      { key: "size", label: "Size" },
      { key: "sizeUnit", label: "Size Unit", type: "select", options: LENGTH_UNITS },
      { key: "secondaryMaterial", label: "Secondary Material" },
      { key: "materialFinish", label: "Material Finish" },
      { key: "careInstructions", label: "Care Instructions", type: "textarea", rows: 2 },
      { key: "itemCondition", label: "Item Condition" },
      { key: "grade", label: "Grade" },
      { key: "numberOfPieces", label: "Number of Pieces", type: "number" },
    ],
  },
  {
    title: "Features & Descriptions",
    fields: [
      { key: "featureBullet1", label: "Feature 1", type: "textarea", rows: 2, helper: "Up to 500 characters" },
      { key: "featureBullet2", label: "Feature 2", type: "textarea", rows: 2, helper: "Up to 500 characters" },
      { key: "featureBullet3", label: "Feature 3", type: "textarea", rows: 2, helper: "Up to 500 characters" },
      { key: "featureBullet4", label: "Feature 4", type: "textarea", rows: 2, helper: "Up to 500 characters" },
      { key: "featureBullet5", label: "Feature 5", type: "textarea", rows: 2, helper: "Up to 500 characters" },
      { key: "whatIsInTheBox", label: "What Is In The Box", type: "textarea", rows: 2, helper: "Up to 500 characters" },
    ],
  },
  {
    title: "Product Dimensions",
    fields: [
      { key: "productLength", label: "Product Length", type: "number" },
      { key: "productLengthUnit", label: "Product Length Unit", type: "select", options: LENGTH_UNITS },
      { key: "productHeight", label: "Product Height", type: "number" },
      { key: "productHeightUnit", label: "Product Height Unit", type: "select", options: LENGTH_UNITS },
      { key: "productWidthDepth", label: "Product Width Depth", type: "number" },
      { key: "productWidthDepthUnit", label: "Product Width Depth Unit", type: "select", options: LENGTH_UNITS },
      { key: "productWeight", label: "Product Weight", type: "number" },
      { key: "productWeightUnit", label: "Product Weight Unit", type: "select", options: WEIGHT_UNITS },
    ],
  },
  {
    title: "Shipping Dimensions",
    fields: [
      { key: "shippingLength", label: "Shipping Length", type: "number" },
      { key: "shippingLengthUnit", label: "Shipping Length Unit", type: "select", options: LENGTH_UNITS },
      { key: "shippingHeight", label: "Shipping Height", type: "number" },
      { key: "shippingHeightUnit", label: "Shipping Height Unit", type: "select", options: LENGTH_UNITS },
      { key: "shippingWidthDepth", label: "Shipping Width Depth", type: "number" },
      { key: "shippingWidthDepthUnit", label: "Shipping Width Depth Unit", type: "select", options: LENGTH_UNITS },
      { key: "shippingWeight", label: "Shipping Weight", type: "number" },
      { key: "shippingWeightUnit", label: "Shipping Weight Unit", type: "select", options: WEIGHT_UNITS },
    ],
  },
  {
    title: "Compliance & Pricing",
    fields: [
      { key: "recommendedRetailPrice", label: "Recommended Retail Price", type: "number" },
      { key: "recommendedRetailPriceAEUnit", label: "Recommended Retail Price AE Unit", type: "select", options: CURRENCY_UNITS },
      { key: "hsCode", label: "HS Code" },
    ],
  },
];
