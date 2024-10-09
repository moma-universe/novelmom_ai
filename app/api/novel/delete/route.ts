// import { NextApiRequest, NextApiResponse } from 'next';
// import connectToDatabase from '@/lib/database/mongodb';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'DELETE') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   await connectToDatabase();

//   try {
//     const { title } = req.body;

//     // 동화 삭제
//     const deletedNovel = await Novel.findOneAndDelete({ title });

//     if (!deletedNovel) {
//       return res.status(404).json({ message: 'Novel not found' });
//     }

//     res.status(200).json({ message: 'Novel deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting novel:', error);
//     res.status(500).json({ message: 'Error deleting novel' });
//   }
// }
