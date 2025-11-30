import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { UserOrderHistory } from "@/types/order";

interface TransactionHistoryProps {
  userOrders: UserOrderHistory['data'];
  isConnected: boolean;
}

export function TransactionHistory({ userOrders, isConnected }: TransactionHistoryProps) {
  return (
    <GlassCard className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Your Transaction History</h3>
      {isConnected ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Date</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.length > 0 ? (
                userOrders.map((order) => (
                  <tr key={order.orderId} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={order.orderType === 'BUY' ? 'default' : 'secondary'}>
                        {order.orderType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3">${order.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={
                        order.status === 'MATCHED' ? 'text-success border-success/30 bg-success/5' :
                          order.status === 'CANCELLED' ? 'text-destructive border-destructive/30 bg-destructive/5' :
                            'text-warning border-warning/30 bg-warning/5'
                      }>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ${(order.price * order.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No transactions found for this asset.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Please connect your wallet to view your transaction history.
        </div>
      )}
    </GlassCard>
  );
}
