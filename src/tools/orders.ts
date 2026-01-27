import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { makeApiRequest, handleApiError } from "../services/api-client.js";
import {
  IpnOrderPaymentSchema,
  type IpnOrderPaymentInput
} from "../schemas/orders.js";

export function registerOrderTools(server: McpServer): void {
  server.registerTool(
    "mentortools_create_order",
    {
      title: "Create Order (IPN Payment)",
      description: `Create a new order and grant course access to a buyer.

This is used for integrating external payment systems with Mentortools.
When an order is created, the buyer automatically gets access to the specified courses.

Args:
  - marketplace_buyer (object, required):
    - email (string, required): Buyer's email
    - first_name, last_name (optional): Buyer's name
    - phone_number (optional): Phone number
    - address (optional): { street_and_number, city, postal_code, country }
  - course_ids (array, required): List of course IDs to unlock
  - id (string, optional): External order ID (will be prefixed with portal ID)
  - transaction (optional):
    - amount (number, required): Transaction amount
    - id (string, optional): External transaction ID

Returns: External order ID and transaction ID`,
      inputSchema: IpnOrderPaymentSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: true
      }
    },
    async (params: IpnOrderPaymentInput) => {
      try {
        const result = await makeApiRequest<{
          external_order_id: string;
          external_transaction_id: string;
        }>("/orders/v1/ipn/payment", "POST", params);

        return {
          content: [{
            type: "text",
            text: `Order created successfully!\n\nExternal Order ID: ${result.external_order_id}\nExternal Transaction ID: ${result.external_transaction_id}`
          }]
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );
}
