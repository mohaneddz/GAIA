"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@/components/ui/table";
import { LucideUser, LucideCreditCard, LucideBell, LucideUsers, LucideShield } from "lucide-react";

type Invoice = { id: string; date: string; amount: string; status: "Paid" | "Pending" | "Failed" };

export default function Settings() {
  // Mock state
  const [name, setName] = useState("Dr. Jane Doe");
  const [email, setEmail] = useState("jane.doe@hospital.org");
  const [plan, setPlan] = useState<"Starter" | "Pro" | "Enterprise">("Pro");
  const [autoRenew, setAutoRenew] = useState(true);
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [notifyWeekly, setNotifyWeekly] = useState(false);
  const [billingEmail, setBillingEmail] = useState("billing@hospital.org");
  const [cardLast4, setCardLast4] = useState("4242");
  const [apiKey, setApiKey] = useState("sk_live_••••••••••••");
  const [revokeConfirm, setRevokeConfirm] = useState("");
  const invoices: Invoice[] = useMemo(
    () => [
      { id: "INV-1001", date: "2025-09-22", amount: "$199.00", status: "Paid" },
      { id: "INV-0995", date: "2025-08-22", amount: "$199.00", status: "Paid" },
      { id: "INV-0890", date: "2025-07-22", amount: "$0.00", status: "Paid" }, // trial invoice
    ],
    []
  );

  // Handlers (replace with real API calls)
  const handleSaveAccount = () => {
    // persist name/email
    alert("Account saved (mock).");
  };

  const handleChangePlan = (newPlan: typeof plan) => {
    setPlan(newPlan);
    alert(`Plan changed to ${newPlan} (mock).`);
  };

  const handleCancelSubscription = () => {
    setPlan("Starter");
    setAutoRenew(false);
    alert("Subscription cancelled (mock).");
  };

  const handleUpdatePayment = () => {
    setCardLast4("1111");
    alert("Payment method updated (mock).");
  };

  const handleGenerateApiKey = () => {
    const newKey = `sk_live_${Math.random().toString(36).slice(2, 12)}`;
    setApiKey(newKey);
    alert("New API key generated (mock).");
  };

  const handleRevokeApiKey = () => {
    if (revokeConfirm.toLowerCase() === "revoke") {
      setApiKey("— revoked —");
      setRevokeConfirm("");
      alert("API key revoked (mock).");
    } else {
      alert('Type "revoke" in the input to confirm.');
    }
  };

  const handleDeleteAccount = () => {
    const ok = confirm("Delete account permanently? This action cannot be undone.");
    if (ok) {
      alert("Account deletion requested (mock).");
    }
  };


  function clearCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }

  return (
    <div className="full py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">GAIA — Settings</h1>
          <p className="text-sm text-slate-600 mt-2">
            Centralized controls for your account, subscription, billing, notifications and data.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <div className="flex items-center justify-center mb-4">
            <TabsList className="rounded-full bg-white/60 p-1 shadow-md">
              <TabsTrigger value="account" className="px-4 rounded-full">Account</TabsTrigger>
              <TabsTrigger value="subscription" className="px-4 rounded-full">Subscription</TabsTrigger>
              <TabsTrigger value="billing" className="px-4 rounded-full">Billing</TabsTrigger>
              <TabsTrigger value="notifications" className="px-4 rounded-full">Notifications</TabsTrigger>
              <TabsTrigger value="team" className="px-4 rounded-full">Team</TabsTrigger>
              <TabsTrigger value="data" className="px-4 rounded-full">Data & Privacy</TabsTrigger>
            </TabsList>
          </div>

          {/* === ACCOUNT === */}
          <TabsContent value="account">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LucideUser /> Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label>Full name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
                      <p className="text-xs text-slate-500 mt-1">Primary contact for notifications and login.</p>
                    </div>
                    <div>
                      <Label>API Key</Label>
                      <div className="flex gap-2 mt-1">
                        <Input value={apiKey} readOnly />
                        <Button onClick={handleGenerateApiKey} variant="outline">Generate</Button>
                        <Button onClick={() => { setRevokeConfirm("revoke"); handleRevokeApiKey(); }} variant="ghost">Quick Revoke</Button>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Use this key to call GAIA programmatically (keep it secret).</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveAccount}>Save changes</Button>
                    <Button variant="ghost" onClick={() => { setName("Dr. Jane Doe"); setEmail("jane.doe@hospital.org"); }}>Reset</Button>
                  </div>
                </CardFooter>
              </Card>

              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">Access & Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Two-factor Authentication</Label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Protect your GAIA account</span>
                          <Switch checked={true} onCheckedChange={() => alert("2FA toggle (mock)")}/>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Single sign-on (SSO)</Label>
                        <p className="text-sm text-slate-600">Enterprise customers can enable SAML/SSO.</p>
                        <Button variant="outline" className="mt-2">Configure SSO</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LucideShield /> Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">HIPAA-ready</div>
                          <p className="text-sm text-slate-500">Data handling controls for healthcare use.</p>
                        </div>
                        <Badge>Included</Badge>
                      </div>

                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">Audit logs</div>
                          <p className="text-sm text-slate-500">Track who accessed what and when.</p>
                        </div>
                        <Badge variant="secondary">Enterprise</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* === SUBSCRIPTION === */}
          <TabsContent value="subscription">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LucideCreditCard /> Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-slate-500">Current plan</div>
                        <div className="font-semibold text-lg">{plan} <span className="text-sm text-slate-500">/ month</span></div>
                      </div>
                      <div>
                        <Badge>{plan === "Pro" ? "Popular" : plan}</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button onClick={() => handleChangePlan("Starter")} className={plan === "Starter" ? "opacity-80" : ""}>Starter</Button>
                        <Button onClick={() => handleChangePlan("Pro")} className={plan === "Pro" ? "opacity-80" : ""}>Pro</Button>
                        <Button onClick={() => handleChangePlan("Enterprise")} className={plan === "Enterprise" ? "opacity-80" : ""}>Enterprise</Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600">Auto renew</div>
                        <Switch checked={autoRenew} onCheckedChange={setAutoRenew} />
                      </div>

                      <div className="text-xs text-slate-500">
                        Pro tip: Pro plan includes faster model access and priority support.
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    <Button onClick={() => alert("Upgrade flow (mock)")}>Manage plan</Button>
                    <Button variant="outline" onClick={handleCancelSubscription}>Cancel</Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Usage summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-3 bg-white/60 rounded-lg text-center">
                      <div className="text-sm text-slate-500">API Calls (30d)</div>
                      <div className="font-semibold text-lg">12,340</div>
                    </div>
                    <div className="p-3 bg-white/60 rounded-lg text-center">
                      <div className="text-sm text-slate-500">Diagnoses generated</div>
                      <div className="font-semibold text-lg">1,050</div>
                    </div>
                    <div className="p-3 bg-white/60 rounded-lg text-center">
                      <div className="text-sm text-slate-500">Avg Latency</div>
                      <div className="font-semibold text-lg">320ms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === BILLING === */}
          <TabsContent value="billing">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LucideCreditCard /> Billing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label>Billing email</Label>
                      <Input value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>Card on file</Label>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm">**** **** **** {cardLast4}</div>
                        <Button size="sm" variant="outline" onClick={() => alert("Update card (mock)")}>Update</Button>
                      </div>
                    </div>
                    <div>
                      <Label>Invoices</Label>
                      <div className="mt-2">
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableHeader>ID</TableHeader>
                              <TableHeader>Date</TableHeader>
                              <TableHeader>Amount</TableHeader>
                              <TableHeader>Status</TableHeader>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {invoices.map((inv) => (
                              <TableRow key={inv.id}>
                                <TableCell>{inv.id}</TableCell>
                                <TableCell>{inv.date}</TableCell>
                                <TableCell>{inv.amount}</TableCell>
                                <TableCell>
                                  <Badge variant={inv.status === "Paid" ? undefined : "secondary"}>{inv.status}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdatePayment}>Save billing</Button>
                    <Button variant="ghost" onClick={() => alert("Download invoices (mock)")}>Export</Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Payment history & receipts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">Recent receipts and downloadable invoices for your records.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === NOTIFICATIONS === */}
          <TabsContent value="notifications">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LucideBell /> Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Critical case alerts</div>
                        <div className="text-sm text-slate-500">Immediate notifications for high-risk diagnoses.</div>
                      </div>
                      <Switch checked={notifyCritical} onCheckedChange={setNotifyCritical} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Weekly summary</div>
                        <div className="text-sm text-slate-500">Aggregated activity & usage emailed weekly.</div>
                      </div>
                      <Switch checked={notifyWeekly} onCheckedChange={setNotifyWeekly} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => alert("Notification settings saved (mock)")}>Save</Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Email</Label>
                      <Input placeholder="notifications@hospital.org" className="mt-1" />
                    </div>
                    <div>
                      <Label>SMS (optional)</Label>
                      <Input placeholder="+1 555 555 5555" className="mt-1" />
                    </div>
                    <div>
                      <Label>Webhook URL</Label>
                      <Input placeholder="https://hooks.example.com/gaia" className="mt-1" />
                      <p className="text-xs text-slate-500 mt-1">Send alerts to your system in real-time.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === TEAM === */}
          <TabsContent value="team">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LucideUsers /> Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label>Invite member</Label>
                      <div className="flex gap-2 mt-2">
                        <Input placeholder="dr.smith@clinic.org" />
                        <Button onClick={() => alert("Invite sent (mock)")}>Invite</Button>
                      </div>
                    </div>
                    <div>
                      <Label>Team size</Label>
                      <div className="mt-2 text-sm text-slate-600">3 members — manage roles and permissions in Enterprise.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Dr. Jane Doe</div>
                        <div className="text-sm text-slate-500">Owner • jane.doe@hospital.org</div>
                      </div>
                      <div className="text-sm text-slate-500">Owner</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Dr. Ahmed Ali</div>
                        <div className="text-sm text-slate-500">Member • ahmed.ali@hospital.org</div>
                      </div>
                      <div className="text-sm text-slate-500">Member</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Nurse Lina</div>
                        <div className="text-sm text-slate-500">Member • lina@hospital.org</div>
                      </div>
                      <div className="text-sm text-slate-500">Member</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === DATA & PRIVACY === */}
          <TabsContent value="data">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><LucideShield /> Data & Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">Data residency</div>
                      <div className="text-sm text-slate-500">US (default) — Enterprise can select region.</div>
                    </div>

                    <div>
                      <div className="font-medium">Retention</div>
                      <div className="text-sm text-slate-500">30 days by default. Contact support for custom retention.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Export & Delete</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="font-medium">Export your data</div>
                        <p className="text-sm text-slate-500">Download a machine-readable archive of your account data.</p>
                        <div className="mt-3">
                          <Button onClick={() => alert("Export started (mock)")}>Start export</Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <div className="font-medium text-red-600">Delete account</div>
                        <p className="text-sm text-slate-500">Deleting your account will remove all data and cannot be undone.</p>
                        <div className="mt-3 flex gap-2">
                          <Button variant="destructive" onClick={handleDeleteAccount}>Delete account</Button>
                          <Button variant="outline" onClick={() => alert("Contact support (mock)")}>Contact support</Button>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium">Clear Chat History</div>
                        <p className="text-sm text-slate-500">Clear saved chat messages and folder from cookies.</p>
                        <div className="mt-3">
                          <Button onClick={() => { clearCookie('chatMessages'); clearCookie('addedPages'); alert('Chat history and folder cleared (mock).'); }}>Clear Cookies</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Audit & Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">Download audit logs or request a compliance package.</p>
                    <div className="mt-4 flex gap-2">
                      <Button onClick={() => alert("Download logs (mock)")}>Download logs</Button>
                      <Button variant="outline" onClick={() => alert("Request compliance package (mock)")}>Request package</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
