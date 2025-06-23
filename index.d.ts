declare module '@snyk/nuget-semver' {
  // comparison
  export function gt(a: string, b: string): boolean;
  export function gte(a: string, b: string): boolean;
  export function lt(a: string, b: string): boolean;
  export function lte(a: string, b: string): boolean;
  export function eq(a: string, b: string): boolean;
  export function neq(a: string, b: string): boolean;
  export function cmp(a: string, comparator: '>' | '>=' | '<' | '<=' | '==' | '!=' | '===' | '!==', b: string): boolean;
  export function compare(a: string, b: string): number;
  export function rcompare(a: string, b: string): number;
  export function diff(a: string, b: string): string | null;

  // functions
  export function valid(version: string): string | null;
  export function prerelease(version: string): (string | number)[] | null;
  export function major(version: string): number;
  export function minor(version: string): number;
  export function patch(version: string): number;

  // ranges
  export function validRange(range: string): string | null;
  export function satisfies(version: string, range: string): boolean;
  export function maxSatisfying(versions: string[], range: string): string | null;
  export function minSatisfying(versions: string[], range: string): string | null;

  // range-parser
  export class DotnetVersionRange {
    constructor(range?: string, components?: string[]);
    addComponent(component: any): void;
    getComponents(): any[];
    getAsText(): string | null;
  }
  export function parseRange(input: string): DotnetVersionRange;

  // versions-parser
  export class DotnetSemver {
    getAsText(): string;
    getPrereleaseComponents(): (string | number)[] | null;
    getMajorVersion(): number;
    getMinorVersion(): number;
    getPatchVersion(): number;
    getVersions(): (string | number)[];
    setOriginalInput(input: string): void;
    setVersion(version: string): void;
    setQualifier(qualifier: string): void;
    parseQualifier(qualifier: string): void;
    addNextToken(qualifier: string, isInteger: boolean): void;
    pushQualifier(qualifier: string): void;
    getQualifiersAsText(): string;
  }
  export function parseVersion(input: string): DotnetSemver;
}
