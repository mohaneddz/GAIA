import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";

const Treatment = () => {
  const chartData = [
    { name: "Diet", value: 80 },
    { name: "Exercise", value: 90 },
    { name: "Medication", value: 70 },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6 p-4 full">
      
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Follow a balanced diet rich in fruits and vegetables.</li>
              <li>Exercise regularly, at least 30 minutes a day.</li>
              <li>Consult with a healthcare professional for personalized advice.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Avoid self-medication without medical supervision.</li>
              <li>Be cautious with over-the-counter supplements.</li>
              <li>Report any adverse reactions immediately.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>General Observations</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Patients often report improved well-being with consistent routines. Monitor progress and adjust as needed based on individual responses.</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="hsl(217, 91%, 22%)" />
                <Bar dataKey="value" fill="hsl(217, 91%, 40%)" />
                <Bar dataKey="value" fill="hsl(217, 91%, 50%)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>Potential Side Effects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Nausea or dizziness may occur initially.</li>
              <li>Monitor for allergic reactions.</li>
              <li>Contact your doctor if symptoms persist.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Regular check-ups are essential. Track your symptoms daily and note any changes.</p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.6 }}>
        <Card>
          <CardHeader>
            <CardTitle>Lifestyle Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              <li>Maintain a sleep schedule.</li>
              <li>Stay hydrated.</li>
              <li>Engage in stress-reducing activities.</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p>For more information, visit reliable health websites or consult a specialist.</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Treatment;
