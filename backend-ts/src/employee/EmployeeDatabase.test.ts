import { EmployeeDatabaseInMemory } from "./EmployeeDatabaseInMemory";

describe("EmployeeDatabase", () => {
  describe("EmployeeDatabaseInMemory", () => {
    let db: EmployeeDatabaseInMemory;

    beforeEach(() => {
      db = new EmployeeDatabaseInMemory();
    });

    describe("getEmployees", () => {
      test("空文字で検索すると全件取得できる", async () => {
        const employees = await db.getEmployees("");
        expect(employees).toHaveLength(3);
        expect(employees.map(e => e.name)).toContain("Jane Doe");
        expect(employees.map(e => e.name)).toContain("John Smith");
        expect(employees.map(e => e.name)).toContain("山田 太郎");
      });

      test("部分文字列で検索できる", async () => {
        const employees = await db.getEmployees("John");
        expect(employees).toHaveLength(1);
        expect(employees[0].name).toBe("John Smith");
      });

      test("日本語の部分文字列で検索できる", async () => {
        const employees = await db.getEmployees("山田");
        expect(employees).toHaveLength(1);
        expect(employees[0].name).toBe("山田 太郎");
      });

      test("複数の結果が返される部分一致", async () => {
        // Jane DoeとJohn Smithの両方が"J"を含む
        const employees = await db.getEmployees("J");
        expect(employees).toHaveLength(2);
        expect(employees.map(e => e.name)).toContain("Jane Doe");
        expect(employees.map(e => e.name)).toContain("John Smith");
      });

      test("完全一致も引き続き動作する", async () => {
        const employees = await db.getEmployees("Jane Doe");
        expect(employees).toHaveLength(1);
        expect(employees[0].name).toBe("Jane Doe");
      });

      test("マッチしない文字列で検索すると0件", async () => {
        const employees = await db.getEmployees("存在しない名前");
        expect(employees).toHaveLength(0);
      });

      test("姓のみで検索できる", async () => {
        const employees = await db.getEmployees("Doe");
        expect(employees).toHaveLength(1);
        expect(employees[0].name).toBe("Jane Doe");
      });

      test("名のみで検索できる", async () => {
        const employees = await db.getEmployees("太郎");
        expect(employees).toHaveLength(1);
        expect(employees[0].name).toBe("山田 太郎");
      });
    });
  });
});