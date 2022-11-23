-- CreateTable
CREATE TABLE "pokemons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "favorite" BOOLEAN NOT NULL DEFAULT false,
    "weight_minimum_kg" DECIMAL NOT NULL,
    "weight_maximum_kg" DECIMAL NOT NULL,
    "height_minimum_m" DECIMAL NOT NULL,
    "height_maximum_m" DECIMAL NOT NULL,
    "flee_rate" DECIMAL NOT NULL,
    "max_cp" INTEGER NOT NULL,
    "max_hp" INTEGER NOT NULL,
    "classification_id" INTEGER NOT NULL,
    "evolution_requirements_id" INTEGER,
    "evolution_requirements_amount" INTEGER,
    CONSTRAINT "pokemons_classification_id_fkey" FOREIGN KEY ("classification_id") REFERENCES "pokemon_classifications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pokemons_evolution_requirements_id_fkey" FOREIGN KEY ("evolution_requirements_id") REFERENCES "pokemon_evolution_requirements" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_evolution_requirements" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pokemon_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pokemons_on_pokemon_types" (
    "pokemon_id" INTEGER NOT NULL,
    "pokemon_type_id" INTEGER NOT NULL,

    PRIMARY KEY ("pokemon_id", "pokemon_type_id"),
    CONSTRAINT "pokemons_on_pokemon_types_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pokemons_on_pokemon_types_pokemon_type_id_fkey" FOREIGN KEY ("pokemon_type_id") REFERENCES "pokemon_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_features" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pokemon_weaknesses" (
    "pokemon_id" INTEGER NOT NULL,
    "pokemon_feature_id" INTEGER NOT NULL,

    PRIMARY KEY ("pokemon_id", "pokemon_feature_id"),
    CONSTRAINT "pokemon_weaknesses_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pokemon_weaknesses_pokemon_feature_id_fkey" FOREIGN KEY ("pokemon_feature_id") REFERENCES "pokemon_features" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_resistants" (
    "pokemon_id" INTEGER NOT NULL,
    "pokemon_feature_id" INTEGER NOT NULL,

    PRIMARY KEY ("pokemon_id", "pokemon_feature_id"),
    CONSTRAINT "pokemon_resistants_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pokemon_resistants_pokemon_feature_id_fkey" FOREIGN KEY ("pokemon_feature_id") REFERENCES "pokemon_features" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_classifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pokemon_attack_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pokemon_attack_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pokemon_attacks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "pokemon_attack_type_id" INTEGER NOT NULL,
    "damage" INTEGER NOT NULL,
    "pokemon_attack_category_id" INTEGER NOT NULL,
    CONSTRAINT "pokemon_attacks_pokemon_attack_type_id_fkey" FOREIGN KEY ("pokemon_attack_type_id") REFERENCES "pokemon_attack_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pokemon_attacks_pokemon_attack_category_id_fkey" FOREIGN KEY ("pokemon_attack_category_id") REFERENCES "pokemon_attack_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemons_on_pokemon_attacks" (
    "pokemon_id" INTEGER NOT NULL,
    "pokemon_attack_id" INTEGER NOT NULL,

    PRIMARY KEY ("pokemon_id", "pokemon_attack_id"),
    CONSTRAINT "pokemons_on_pokemon_attacks_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pokemons_on_pokemon_attacks_pokemon_attack_id_fkey" FOREIGN KEY ("pokemon_attack_id") REFERENCES "pokemon_attacks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pokemon_evolutions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pokemon_id" INTEGER NOT NULL,
    "pokemon_previous_id" INTEGER,
    "pokemon_next_id" INTEGER,
    CONSTRAINT "pokemon_evolutions_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemons" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pokemon_evolutions_pokemon_previous_id_fkey" FOREIGN KEY ("pokemon_previous_id") REFERENCES "pokemons" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pokemon_evolutions_pokemon_next_id_fkey" FOREIGN KEY ("pokemon_next_id") REFERENCES "pokemons" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "pokemons_name_key" ON "pokemons"("name");

-- CreateIndex
CREATE INDEX "pokemons_favorite_idx" ON "pokemons"("favorite");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_evolution_requirements_name_key" ON "pokemon_evolution_requirements"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_types_name_key" ON "pokemon_types"("name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_features_name_key" ON "pokemon_features"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_classifications_name_key" ON "pokemon_classifications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_attack_categories_name_key" ON "pokemon_attack_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_attack_types_name_key" ON "pokemon_attack_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_attacks_name_key" ON "pokemon_attacks"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pokemon_evolutions_pokemon_id_pokemon_previous_id_pokemon_next_id_key" ON "pokemon_evolutions"("pokemon_id", "pokemon_previous_id", "pokemon_next_id");
