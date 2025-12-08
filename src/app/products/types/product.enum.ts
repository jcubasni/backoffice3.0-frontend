export enum ProductGroup {
	VARIOS = 1,
	LUBRICANTES = 2,
	BEBIDAS_SNACKS = 3,
	ANTICIPOS = 4,
	COMBUSTIBLES = 5,
}

export const PRODUCT_GROUP_NAMES: Record<ProductGroup, string> = {
	[ProductGroup.VARIOS]: "Productos varios",
	[ProductGroup.LUBRICANTES]: "Lubricantes",
	[ProductGroup.BEBIDAS_SNACKS]: "Bebidas y snacks",
	[ProductGroup.ANTICIPOS]: "Anticipos",
	[ProductGroup.COMBUSTIBLES]: "Combustibles",
}
