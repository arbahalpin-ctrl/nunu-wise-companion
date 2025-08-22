import { ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const HelpFAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Is Nunu a replacement for a doctor or therapist?",
      answer: "No. Nunu is not a medical or mental health professional.\nWe're here for gentle, emotional support — not diagnosis, prescriptions, or crisis care."
    },
    {
      question: "How does the AI work? Is it safe?",
      answer: "Nunu uses secure, context-aware AI to offer personalized support based on your baby's age, your routines, and your check-ins.\nWe never store your chats to train AI, and we don't sell your data. Ever."
    },
    {
      question: "Will my emotional check-ins or chats be shared?",
      answer: "Absolutely not.\nYour emotional logs and voice notes stay between you and Nunu. You can delete them any time."
    },
    {
      question: "I'm not a first-time mum. Can I still use Nunu?",
      answer: "Of course.\nNunu is for anyone navigating the early stages of motherhood — whether it's your first or your third."
    },
    {
      question: "I'm not comfortable being called \"mama.\" Can I change that?",
      answer: "Yes. You can choose how Nunu addresses you — \"mama,\" \"parent,\" \"love,\" or even your name.\nThis is your space."
    },
    {
      question: "Is this app inclusive of different types of families?",
      answer: "Yes.\nWe're building Nunu to support all types of parents, regardless of gender, structure, or background.\nIf something feels off, we want to hear from you."
    },
    {
      question: "Is this app free?",
      answer: "Nunu will offer free core features, including mood check-ins, baby tracking, and gentle AI support.\nThere will also be an optional premium tier with extras like custom plans, community access, and advanced features — but we'll never pressure you."
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-gradient-comfort">
      <div className="bg-gradient-calm p-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Help & FAQ</h1>
        </div>
        <p className="text-muted-foreground">Honest, soft, supportive answers</p>
      </div>

      <div className="p-6 space-y-4">
        {faqs.map((faq, index) => (
          <Card key={index} className="shadow-gentle border-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start gap-3 text-base">
                <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">{faq.question}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pl-14">
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {faq.answer}
              </div>
              {index < faqs.length - 1 && (
                <Separator className="mt-4 bg-border/50" />
              )}
            </CardContent>
          </Card>
        ))}

        {/* Contact Support */}
        <Card className="shadow-gentle border-none bg-secondary-soft">
          <CardContent className="p-6 text-center">
            <h4 className="font-medium mb-2">Still need help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              We're here to listen and support you through your journey.
            </p>
            <Button variant="outline" className="rounded-xl">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpFAQ;