import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if necessary

export async function GET(req) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const orders = await prisma.order.findMany({
        where: {
          OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
        },
        include: { buyer: true, seller: true },
      });
  
      return NextResponse.json(orders);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
  }
  