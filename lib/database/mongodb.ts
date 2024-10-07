// import { MongoClient, Db } from "mongodb";

// const uri = process.env.MONGODB_URI;
// const dbName = process.env.MONGODB_DB;

// if (!uri) {
//   throw new Error(
//     "Please define the MONGODB_URI environment variable inside .env.local"
//   );
// }

// if (!dbName) {
//   throw new Error(
//     "Please define the MONGODB_DB environment variable inside .env.local"
//   );
// }

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// declare global {
//   var __mongoClientPromise: Promise<MongoClient>;
// }

// if (process.env.NODE_ENV === "development") {
//   if (!global.__mongoClientPromise) {
//     client = new MongoClient(uri);
//     global.__mongoClientPromise = client.connect();
//   }
//   clientPromise = global.__mongoClientPromise;
// } else {
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export async function getDatabase(): Promise<Db> {
//   const client = await clientPromise;
//   return client.db(dbName);
// }
import mongoose, { Connection } from "mongoose";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

declare global {
  // 전역 변수를 선언하여 개발 모드에서의 중복 연결을 방지합니다.
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

const MONGOOSE_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: dbName,
  // 필요한 추가 옵션을 여기에 설정할 수 있습니다.
};

// 전역 변수가 존재하지 않으면 초기화합니다.
if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

/**
 * Mongoose를 사용하여 데이터베이스에 연결하고 연결 객체를 반환합니다.
 * 개발 환경에서는 전역 변수를 사용하여 중복 연결을 방지합니다.
 */
async function connectToDatabase(): Promise<Connection> {
  if (global.mongoose.conn) {
    // 이미 연결된 경우 기존 연결을 반환합니다.
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    if (!uri) {
      throw new Error("MONGODB_URI가 정의되지 않았습니다.");
    }
    global.mongoose.promise = mongoose
      .connect(uri, MONGOOSE_OPTIONS)
      .then((mongoose) => {
        return mongoose.connection;
      });
  }

  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

export default connectToDatabase;
