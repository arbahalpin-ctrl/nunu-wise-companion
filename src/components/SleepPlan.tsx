import { useState } from 'react';
import { Moon, Sun, Clock, CheckCircle2, ChevronDown, ChevronUp, Calendar, Sparkles, Heart, AlertTriangle, Info, BookOpen, Brain, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SleepAssessmentData } from './SleepAssessment';

interface SleepPlanProps {
  assessment: SleepAssessmentData;
  onStartProgram: () => void;
  onEditAssessment: () => void;
  onOpenChat?: () => void;
}

interface RecommendedMethod {
  id: string;
  name: string;
  description: string;
  whyForYou: string;
  howItWorks: string[];
  whatToExpect: string[];
  nightOneInstructions: string[];
  checkInIntervals?: number[];
  science: {
    overview: string;
    mechanism: string;
    research: string[];
    childOutcomes: string[];
    parentBenefits: string[];
    commonConcerns: { concern: string; evidence: string }[];
  };
}

const SleepPlan = ({ assessment, onStartProgram, onEditAssessment, onOpenChat }: SleepPlanProps) => {
  const [showFullPlan, setShowFullPlan] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showScience, setShowScience] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [showNunuPrompt, setShowNunuPrompt] = useState(true);

  // Generate recommended method based on assessment
  const getRecommendedMethod = (): RecommendedMethod => {
    const { cryingTolerance, babyAgeMonths, currentSleepAssociations, previousAttempts } = assessment;
    
    // Very low crying tolerance or very young baby
    if (cryingTolerance <= 2 || babyAgeMonths < 4) {
      return {
        id: 'fading',
        name: 'Gentle Steps',
        description: 'Our most gradual approach — tiny changes over 2-3 weeks with minimal tears.',
        whyForYou: cryingTolerance <= 2 
          ? "Based on your comfort level, Gentle Steps will feel right for your family. Small changes, big results over time."
          : `At ${babyAgeMonths} months, Gentle Steps works beautifully while ${assessment.babyName}'s sleep naturally matures.`,
        howItWorks: [
          `Continue your current way of helping ${assessment.babyName} sleep, but make tiny changes`,
          'If you rock to sleep, rock until drowsy then place down (not fully asleep)',
          'Each night, stop the soothing slightly earlier',
          'If baby fusses, comfort immediately — this is responsive parenting',
          'Progress happens slowly over 2-3 weeks, but with very little distress'
        ],
        whatToExpect: [
          'Minimal crying — mostly just fussing',
          'Very gradual progress (think weeks, not days)',
          'You stay very involved in the process',
          'Low stress for everyone, but requires patience'
        ],
        nightOneInstructions: [
          'Do your normal bedtime routine',
          `When ${assessment.babyName} is drowsy but not fully asleep, place in crib`,
          'If crying starts, pick up and comfort until calm, then try again',
          'Tonight is just about trying — no pressure for success',
          'End your soothing slightly earlier than usual'
        ],
        science: {
          overview: "Gentle Steps (also known as 'fading' or 'gradual withdrawal') works by slowly reducing parental involvement in sleep onset while maintaining a strong attachment bond. This approach aligns with attachment theory principles established by John Bowlby and Mary Ainsworth, which emphasize responsive caregiving while gradually supporting infant autonomy.",
          mechanism: "When babies fall asleep with parental assistance (rocking, feeding, holding), they form a 'sleep association' — their brain links that assistance to the process of falling asleep. When they wake naturally between sleep cycles (which all humans do, every 45-90 minutes), they signal for that same assistance. Gentle Steps works by gradually shifting this association from external soothing to internal self-regulation, allowing the baby's natural ability to self-settle to emerge without distress.",
          research: [
            "A 2012 study in Pediatrics followed 326 families and found that gentle sleep interventions showed no adverse effects on child emotional development, behavior, or parent-child attachment at age 6.",
            "Research by Dr. Jodi Mindell (2006) demonstrated that gradual approaches are equally effective as more intensive methods when followed consistently, with 80% of families seeing improvement within 2 weeks.",
            "The Australian 'Possums' approach research shows that gradual, responsive methods support both sleep and attachment security, particularly for anxiety-sensitive parents.",
            "A longitudinal study in Sleep Medicine (2018) found that children who learned to self-settle through gradual methods showed better sleep quality at 2 and 4 years of age."
          ],
          childOutcomes: [
            "Secure attachment maintained — multiple studies confirm no difference in attachment security between sleep-trained and non-sleep-trained infants",
            "Improved sleep consolidation leads to better cognitive development and memory formation",
            "Better emotional regulation over time as self-soothing skills develop",
            "Reduced night wakings correlate with improved daytime mood and reduced irritability",
            "No evidence of increased anxiety, behavioral problems, or stress in longitudinal follow-ups"
          ],
          parentBenefits: [
            "Lower parental stress during the process due to minimal crying",
            "Reduced risk of postnatal depression — studies show improving infant sleep significantly reduces maternal depression symptoms",
            "Parents report feeling more confident in their responsiveness because they can comfort immediately",
            "Better parental sleep quality improves cognitive function, patience, and relationship satisfaction"
          ],
          commonConcerns: [
            {
              concern: "Will this harm our attachment bond?",
              evidence: "A landmark 2012 study in Pediatrics (Hiscock et al.) followed children until age 6 and found no differences in emotional health, behavior, sleep problems, or parent-child closeness between sleep-trained and control groups. Attachment is built through thousands of daily responsive interactions, not just nighttime."
            },
            {
              concern: "Is my baby too young for this?",
              evidence: "Gentle approaches are considered safe from around 4 months when circadian rhythms develop. Before 4 months, you're simply laying groundwork. The American Academy of Pediatrics notes that sleep learning is developmentally appropriate once babies have the neurological capacity for longer sleep stretches."
            },
            {
              concern: "What if it takes too long?",
              evidence: "Gentle methods typically take 2-3 weeks compared to 3-7 days for more intensive approaches. However, research shows similar success rates at the 3-month mark, and many parents find the slower pace more sustainable and less stressful."
            }
          ]
        }
      };
    }
    
    // Mid tolerance — Chair method or PUPD
    if (cryingTolerance === 3) {
      // If they've tried PUPD before and it didn't work, try chair
      if (previousAttempts.includes('pupd')) {
        return {
          id: 'chair',
          name: 'Gradual Presence',
          description: 'Stay close while slowly building independence — you retreat as confidence grows.',
          whyForYou: "You want to be there for your baby while teaching self-settling. Gradual Presence lets you support without creating new dependencies.",
          howItWorks: [
            `Put ${assessment.babyName} down drowsy but awake`,
            'Sit in a chair right next to the crib',
            'Offer verbal comfort ("Shh, you\'re okay") and occasional pats',
            'Stay until baby falls asleep',
            'Every 2-3 nights, move your chair farther from the crib',
            'Eventually, you\'ll be outside the room'
          ],
          whatToExpect: [
            'Some crying, but your presence helps limit it',
            'Takes about 2 weeks to complete',
            'First few nights you\'re right there, which feels reassuring',
            'Progress is visible as you move farther away'
          ],
          nightOneInstructions: [
            'Complete your normal bedtime routine',
            `Place ${assessment.babyName} in crib drowsy but awake`,
            'Sit in a chair right next to the crib — baby should see you',
            'Don\'t pick up, but use your voice: "Shh, it\'s okay, time for sleep"',
            'You can pat the mattress or baby\'s tummy intermittently',
            'Stay until baby falls asleep (this might take a while tonight!)',
            'If baby stands, gently lay back down once, then just stay calm'
          ],
          science: {
            overview: "Gradual Presence (also called the 'Chair Method' or 'Camping Out') was developed by sleep researcher Dr. Kim West. It works on the principle that physical parental presence provides security while the baby learns to self-settle. Your presence acts as a 'secure base' from which your baby can develop independence — a core concept in attachment theory.",
            mechanism: "Babies are biologically programmed to seek proximity to caregivers, especially when tired or distressed. By remaining present but gradually reducing intervention, you're teaching your baby that you're nearby and responsive, while also allowing them to discover their own self-soothing abilities. The gradual retreat prevents the 'cold turkey' separation that can feel distressing. Each move of the chair represents a small, manageable increase in independence that builds your baby's confidence.",
            research: [
              "Dr. Kim West's 'Sleep Lady Shuffle' method has been used with over 20,000 families with reported success rates of over 90% when followed consistently.",
              "A 2016 study in Pediatrics found that graduated extinction methods (including chair-based approaches) showed no adverse effects on infant stress, as measured by cortisol levels, attachment, or behavioral outcomes.",
              "Research published in Child Development (2019) demonstrated that parental presence during sleep learning leads to equivalent outcomes compared to check-and-console methods, with some parents reporting lower anxiety.",
              "A meta-analysis of 52 sleep training studies (Mindell et al., 2006) found that methods involving parental presence were particularly effective for parents with higher baseline anxiety."
            ],
            childOutcomes: [
              "Secure attachment is maintained — your physical presence throughout the early stages reinforces safety",
              "Studies show no difference in cortisol (stress hormone) levels compared to control groups",
              "Children develop robust self-soothing skills that generalize to other situations (managing frustration, calming down after excitement)",
              "Improved sleep duration and quality supports brain development, particularly memory consolidation and emotional processing",
              "Long-term follow-ups show no behavioral differences or anxiety disorders linked to gradual sleep training"
            ],
            parentBenefits: [
              "Many parents find this emotionally easier because they can see and hear that their baby is safe",
              "The gradual retreat gives parents time to adjust to increasing separation, reducing parental anxiety",
              "Visual evidence of progress (moving the chair) provides motivation and confidence",
              "Studies show reduced maternal depression symptoms within 2 weeks of starting sleep intervention"
            ],
            commonConcerns: [
              {
                concern: "Won't my presence be a distraction?",
                evidence: "Initially, yes — some babies may protest more with a parent visible but not helping. This typically resolves by night 2-3 as they understand the new pattern. Research shows this does not prolong the learning process overall."
              },
              {
                concern: "What if my baby gets more upset because I'm right there but not picking them up?",
                evidence: "This is called 'protest crying' and is different from distress crying. Your baby is communicating disagreement, not fear or abandonment. Studies using heart rate variability (a stress measure) show that babies with a present parent show lower physiological stress even during protest."
              },
              {
                concern: "Is this just drawing out the process unnecessarily?",
                evidence: "Research shows that speed of learning is less important than consistency and sustainability. Families who choose gradual methods report higher satisfaction and lower relapse rates at 6-month follow-ups, likely because the approach felt more aligned with their parenting values."
              }
            ]
          }
        };
      }
      
      return {
        id: 'pupd',
        name: 'Comfort & Settle',
        description: 'Hands-on reassurance — pick up to calm, put down to sleep. Repeat with love.',
        whyForYou: "You want to stay responsive while teaching self-settling. Comfort & Settle keeps you connected throughout the process.",
        howItWorks: [
          `Put ${assessment.babyName} down drowsy but awake`,
          'When crying starts, pick up and comfort until calm',
          'The moment baby is calm (not asleep!), put back down',
          'Repeat as many times as needed — could be 20+ times at first',
          'Over nights, baby needs fewer pick-ups'
        ],
        whatToExpect: [
          'Night 1 can be exhausting — many repetitions',
          'Crying happens, but you\'re always responding',
          'Improvement usually visible by night 3-4',
          'Physically tiring but emotionally easier for some parents'
        ],
        nightOneInstructions: [
          'Complete your normal bedtime routine',
          `Place ${assessment.babyName} in crib drowsy but awake`,
          'Step back and wait',
          'If crying, pick up immediately and comfort — hold until calm',
          'As soon as calm (but still awake!), put back down',
          'Repeat. Expect 20-40 repetitions tonight — that\'s normal',
          'Stay calm and consistent. This is a marathon, not a sprint.'
        ],
        science: {
          overview: "Comfort & Settle (often called 'Pick Up, Put Down' or PUPD) was popularized by Tracy Hogg in 'The Baby Whisperer.' It's grounded in the principle of responsive parenting — consistently answering your baby's distress signals while still teaching self-settling. This method respects that babies need reassurance while building their capacity for independent sleep.",
          mechanism: "When you pick up your crying baby, you're communicating 'I'm here, you're safe.' When you put them down calm but awake, you're communicating 'I trust you to do this.' The repetition teaches your baby that: (1) crying gets a response, so they don't need to escalate, and (2) falling asleep happens in the crib. Over time, your baby's nervous system learns that the crib is safe, and they need less external regulation to transition to sleep. This process supports the development of the infant's own regulatory capacity.",
          research: [
            "A 2007 study in Sleep journal found that responsive methods involving physical comfort showed equal effectiveness to graduated extinction when measured at 3-month follow-up.",
            "Research by Dr. Thomas Anders at UC Davis demonstrated that all babies wake multiple times per night — the difference is whether they 'signal' (cry) or 'self-soothe' back to sleep. PUPD teaches self-soothing while maintaining responsiveness.",
            "A study in the Journal of Pediatric Psychology (2014) found that responsive sleep interventions did not elevate infant cortisol levels or alter the HPA (stress) axis development.",
            "Neuroimaging research shows that responsive caregiving promotes healthy development of the prefrontal cortex, which is crucial for self-regulation."
          ],
          childOutcomes: [
            "Maintained responsiveness means your baby's trust in you as a caregiver remains strong",
            "The physical comfort provided during pick-ups reinforces secure attachment",
            "Babies learn that their signals are heard, which supports healthy communication development",
            "Self-regulation skills developed through this process extend to other areas — research links infant sleep self-regulation to better emotional regulation in toddlerhood",
            "No evidence of elevated cortisol, altered stress response, or attachment disruption in controlled studies"
          ],
          parentBenefits: [
            "Many parents report this method feels 'right' because they're never leaving their baby to cry alone",
            "The active involvement can feel empowering — you're doing something, not just waiting",
            "Physical contact releases oxytocin in both parent and baby, reducing stress for both",
            "Parents often report less guilt because they can comfort freely"
          ],
          commonConcerns: [
            {
              concern: "Isn't all the picking up and putting down confusing for the baby?",
              evidence: "Initially, it may seem that way, but babies are pattern-recognition experts. Within 2-3 nights, most babies understand the pattern: cry → pickup → calm → crib → sleep. The consistency is key, and the learning curve is actually quite fast."
            },
            {
              concern: "What if the baby falls asleep during the pick-up?",
              evidence: "This happens, especially early on. The goal is 'drowsy but awake' when you put down, so if they're asleep, wake them slightly before putting down. Some sleep consultants suggest a gentle jostle. It feels counterintuitive but is important for teaching self-settling."
            },
            {
              concern: "This sounds exhausting — how long does night 1 really take?",
              evidence: "First nights can take 1-2 hours and involve 30-50 pick-ups. This is normal and decreases rapidly. Most families see a 50% reduction by night 3. Studies show that parental perception of difficulty decreases after night 2, even when objective measures show it's still hard — you adapt quickly."
            }
          ]
        }
      };
    }
    
    // Higher tolerance — Timed Reassurance
    if (cryingTolerance === 4) {
      return {
        id: 'ferber',
        name: 'Timed Reassurance',
        description: 'Structured check-ins at growing intervals — effective, research-backed, and balanced.',
        whyForYou: "You want structure with reassurance. Timed Reassurance is our most popular approach — clear steps, proven results.",
        howItWorks: [
          `Put ${assessment.babyName} down drowsy but awake`,
          'Leave the room',
          'If crying, wait 3 minutes before your first check',
          'Check-ins are brief (1-2 mins): reassure verbally, maybe a pat, then leave',
          'Increase wait times: 3 → 5 → 10 → 12 → 15 minutes',
          'On subsequent nights, start with longer intervals'
        ],
        whatToExpect: [
          'Night 1: Usually 30-60 mins of crying with check-ins',
          'Night 2-3: Often worse (extinction burst) — this is normal',
          'Night 4-5: Significant improvement for most babies',
          'By day 7: Most babies fall asleep with minimal fussing'
        ],
        nightOneInstructions: [
          'Complete bedtime routine in a calm, dimly lit room',
          `Put ${assessment.babyName} in crib awake — say goodnight and leave`,
          '⏱️ Wait 3 minutes before first check (even if crying)',
          'Check 1: Enter briefly, say "I love you, it\'s time to sleep", pat for 30 seconds, leave',
          '⏱️ Wait 5 minutes before second check',
          '⏱️ Wait 10 minutes before third check',
          '⏱️ Continue at 10-minute intervals until asleep',
          'For night wakings, use the same intervals'
        ],
        checkInIntervals: [3, 5, 10, 10, 10],
        science: {
          overview: "Timed Reassurance (commonly called the 'Ferber Method' after Dr. Richard Ferber, or 'Graduated Extinction') is one of the most extensively researched sleep training approaches. Developed at Boston Children's Hospital Sleep Center, it's based on the principle that periodic check-ins provide reassurance while graduated intervals teach self-soothing. The method has been studied in over 50 clinical trials across multiple countries.",
          mechanism: "When babies rely on external help to fall asleep (feeding, rocking, patting), they form 'sleep onset associations.' During natural sleep cycle transitions (every 45-90 minutes), they wake briefly and seek those same conditions. Timed Reassurance works by allowing your baby to practice self-settling while knowing you're nearby. The graduated intervals serve two purposes: (1) they prevent immediate reinforcement of crying, which would strengthen the crying-help association, and (2) they provide regular reassurance that you haven't abandoned them. Over nights, the intervals get longer and your baby's self-settling capacity strengthens.",
          research: [
            "A landmark 2006 meta-analysis in SLEEP journal reviewed 52 studies and concluded graduated extinction was 'well-established' as an effective treatment, with 94% of studies showing significant improvement.",
            "The Murdoch Children's Research Institute (2012) conducted a 5-year follow-up study of 326 infants who underwent Ferber-style training. At age 6, there were no differences in emotional health, behavior, sleep problems, or parent-child attachment compared to controls.",
            "A 2016 study in Pediatrics measured infant cortisol (stress hormone) levels during sleep training and found no significant elevation compared to baseline or control groups — challenging the 'toxic stress' myth.",
            "Research published in the Journal of Child Psychology and Psychiatry (2018) followed sleep-trained children to age 5 and found improved behavioral outcomes and lower rates of maternal depression in the intervention group.",
            "Dr. Mindell's research at the Children's Hospital of Philadelphia found graduated extinction effective across cultures, with similar results in studies conducted in the US, UK, Australia, Israel, and Japan."
          ],
          childOutcomes: [
            "No differences in cortisol levels, stress reactivity, or HPA axis function between sleep-trained and control infants in controlled studies",
            "Secure attachment rates are identical between sleep-trained and non-sleep-trained groups at 12 months and beyond",
            "Improved sleep duration supports brain development — sleep is when the brain consolidates learning and memories",
            "Better daytime mood, reduced irritability, and improved feeding behaviors are commonly reported following successful sleep training",
            "Long-term follow-ups (5+ years) show no increased rates of anxiety, depression, behavioral problems, or attachment disorders",
            "Some studies suggest improved behavioral self-regulation in toddlerhood among children who learned to self-settle as infants"
          ],
          parentBenefits: [
            "Clear, structured protocol reduces decision fatigue — you know exactly what to do",
            "Studies show significant reduction in maternal depression symptoms within 2 weeks of intervention",
            "Improved parental sleep leads to better daytime cognitive function, patience, and relationship quality",
            "Parents report improved confidence in their ability to understand and respond to their baby's needs",
            "The method's extensive research base provides reassurance that you're making an evidence-based choice"
          ],
          commonConcerns: [
            {
              concern: "Will my baby feel abandoned?",
              evidence: "The check-ins are specifically designed to prevent feelings of abandonment. Your baby hears your voice and sees you at regular, predictable intervals. Studies using video analysis show that babies often calm during checks, demonstrating recognition and reassurance. Attachment is built through thousands of daily responsive interactions — not just nighttime."
            },
            {
              concern: "Is the crying harmful to my baby's brain?",
              evidence: "This concern comes from research on 'toxic stress' — but that research studied severe, prolonged neglect (orphanages, abuse), not controlled, time-limited crying with responsive parents during the day. Multiple studies measuring cortisol during sleep training show no harmful elevation. Dr. Michael Gradisar's 2016 study found that infants' cortisol levels actually DECREASED over the training period."
            },
            {
              concern: "What about the 'extinction burst' — night 2 being worse?",
              evidence: "This is a well-documented behavioral phenomenon. When a previously reinforced behavior (crying → picking up) stops working, the behavior intensifies temporarily before extinguishing. This is actually a sign that learning is occurring. Knowing to expect it helps parents persist. Studies show that 85% of families who make it past night 3 report success by night 7."
            },
            {
              concern: "I've read that babies just 'give up' and that's not real learning",
              evidence: "This myth isn't supported by evidence. Babies who successfully sleep train show active self-soothing behaviors (thumb-sucking, position adjustment, comfort object use) — not passive resignation. EEG studies show normal, healthy sleep patterns. And these babies show the same enthusiasm for parental interaction during the day, suggesting no emotional shutdown."
            }
          ]
        }
      };
    }
    
    // Highest tolerance — Confident Sleep
    return {
      id: 'extinction',
      name: 'Confident Sleep',
      description: 'Full trust in your baby\'s ability to self-settle. Clear, direct, fastest results.',
      whyForYou: "You're ready for the most direct approach. Confident Sleep gets results quickly — usually within 3-5 nights.",
      howItWorks: [
        `Put ${assessment.babyName} down drowsy but awake`,
        'Say goodnight and leave the room',
        'Don\'t return until morning (or a scheduled feed time if applicable)',
        'Baby learns to self-settle without any intervention'
      ],
      whatToExpect: [
        'Night 1: Potentially 45-90 mins of crying',
        'Night 2: Often the hardest night (extinction burst)',
        'Night 3-4: Usually dramatic improvement',
        'By day 5-7: Most babies fuss briefly then sleep'
      ],
      nightOneInstructions: [
        'Complete your full bedtime routine',
        'Make sure baby is fed, changed, and comfortable',
        `Put ${assessment.babyName} in crib awake — say "I love you, goodnight"`,
        'Leave the room and close the door',
        'Do not go back in until morning (or scheduled feed)',
        'This is hard. Watch on a monitor if it helps. Baby is safe.',
        'Find something to distract yourself — this is the hardest part for parents'
      ],
      science: {
        overview: "Confident Sleep (clinically known as 'Extinction' or 'Unmodified Extinction') is the most direct approach to sleep training. Despite its intensity, it's extensively researched and considered safe by major pediatric organizations. This method is based on the behavioral principle that behaviors that aren't reinforced will diminish. It's often the fastest approach and may result in less total crying than prolonged gentler methods.",
        mechanism: "When a baby's crying consistently results in parental intervention (picking up, feeding, rocking), the crying behavior is reinforced. In behavioral terms, it 'works,' so it continues. Extinction removes this reinforcement entirely. Without reinforcement, the behavior diminishes — typically within 3-5 nights. Importantly, this only applies to the crying-for-assistance behavior at sleep times; your daytime responsiveness teaches your baby that their communication is heard. The brain is capable of learning context-specific rules: 'nighttime in crib' becomes associated with self-settling.",
        research: [
          "A comprehensive 2006 meta-analysis of 52 treatment studies found 'unmodified extinction' to be the fastest and most effective method, with significant improvements in 100% of studies reviewed.",
          "The 2012 Australian study (Hiscock et al.) following 326 infants found no adverse effects on stress, attachment, or behavioral outcomes at age 6 — this included infants trained using extinction.",
          "Research measuring salivary cortisol (Price et al., 2012) found that extinction did not chronically elevate stress hormones; any temporary increase returned to baseline within days.",
          "A 2016 Pediatrics study by Gradisar et al. found that extinction resulted in LESS total crying over the training period compared to graduated approaches, contrary to intuition — because the faster resolution meant fewer nights of any crying.",
          "Video analysis studies show that infants develop active self-soothing strategies (sucking, repositioning, comfort objects) rather than 'giving up' — evidence of learning, not shutdown."
        ],
        childOutcomes: [
          "Fastest resolution means less total crying over the intervention period in many cases",
          "Studies show no elevation in cortisol levels, no changes to stress reactivity, and no alterations to HPA axis development",
          "Attachment security is unaffected — major studies show identical attachment classifications between extinction, graduated, and control groups",
          "Sleep improvements are often the most dramatic and sustained with extinction approaches",
          "No evidence of increased anxiety, depression, or behavioral problems in any longitudinal study",
          "Infants show the same enthusiasm for parental interaction, social engagement, and exploration — no evidence of withdrawal or emotional damage"
        ],
        parentBenefits: [
          "Fastest results means parents return to normal sleep sooner — critical for mental health",
          "The simplicity removes decision-making — there's just one rule, which some parents find clearer",
          "Studies show the most significant reduction in maternal depression symptoms with extinction, likely due to speed",
          "Once committed, the approach is over quickly — parents report 'ripping off the band-aid' feels better than prolonged intervention"
        ],
        commonConcerns: [
          {
            concern: "Isn't this just leaving my baby to cry and damaging their trust?",
            evidence: "Attachment is built through thousands of responsive interactions across the day — feeding, playing, comforting, connecting. A few nights of not responding at bedtime does not undo this. Studies directly measuring attachment security (using the gold-standard 'Strange Situation' procedure) show no difference between extinction-trained infants and controls. Your baby's trust in you is robust."
          },
          {
            concern: "I read this causes toxic stress and brain damage",
            evidence: "The 'toxic stress' research comes from studies of severe neglect — orphanages, abuse, chronic caregiver unresponsiveness across ALL domains of care. It does not apply to time-limited, nighttime-specific sleep training by otherwise loving, responsive parents. Multiple studies measuring cortisol during extinction show no harmful chronic elevation. Dr. Harriet Hiscock's 5-year follow-up found no differences in stress-related outcomes."
          },
          {
            concern: "What if my baby vomits or has a real need?",
            evidence: "Safety checks are always appropriate. Brief checks (without picking up) for genuine safety concerns are fine. If your baby vomits, clean up calmly and quietly, then resume. This is different from responding to crying itself. Your parental instinct for 'something is really wrong' versus 'my baby is protesting' is usually accurate."
          },
          {
            concern: "Night 2 being worse seems unbearable",
            evidence: "The 'extinction burst' (night 2 often being harder) is well-documented in behavioral science. When a behavior that used to work stops working, it intensifies before stopping. Think of an adult hitting an elevator button repeatedly when it doesn't respond. This is temporary and is actually a sign of learning. Knowing to expect it helps many parents persist. After night 3, most families see dramatic improvement."
          },
          {
            concern: "I don't think I can do this — is that okay?",
            evidence: "Absolutely. This method isn't for everyone, and that's fine. The best sleep training method is the one you can follow consistently. If the thought of extinction feels wrong for your family, choose a more gradual method. Your emotional wellbeing and confidence as a parent matter. All evidence-based methods work when followed consistently."
          }
        ]
      }
    };
  };

  // Generate optimal schedule based on age and assessment
  const generateSchedule = () => {
    const { babyAgeMonths, currentNapCount, currentWakeTime, currentBedtime } = assessment;
    
    // Parse times
    const [wakeHour, wakeMin] = currentWakeTime.split(':').map(Number);
    
    // Recommend optimal schedule based on age
    let recommendedNaps = currentNapCount;
    let wakeWindows: number[] = [];
    let napDurations: number[] = [];
    
    if (babyAgeMonths <= 3) {
      recommendedNaps = 4;
      wakeWindows = [60, 75, 90, 90];
      napDurations = [45, 45, 45, 30];
    } else if (babyAgeMonths <= 5) {
      recommendedNaps = 3;
      wakeWindows = [90, 120, 120, 150];
      napDurations = [90, 60, 45];
    } else if (babyAgeMonths <= 8) {
      recommendedNaps = 3;
      wakeWindows = [120, 150, 150, 180];
      napDurations = [90, 60, 30];
    } else if (babyAgeMonths <= 14) {
      recommendedNaps = 2;
      wakeWindows = [180, 210, 240];
      napDurations = [90, 60];
    } else {
      recommendedNaps = 1;
      wakeWindows = [300, 330];
      napDurations = [120];
    }
    
    // Build schedule
    const schedule: { time: string; event: string; notes?: string }[] = [];
    let currentTime = new Date();
    currentTime.setHours(wakeHour, wakeMin, 0, 0);
    
    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    schedule.push({ 
      time: formatTime(currentTime), 
      event: 'Morning wake',
      notes: 'Start the day — bright light, activity'
    });
    
    for (let i = 0; i < recommendedNaps; i++) {
      // Add wake window
      currentTime = new Date(currentTime.getTime() + wakeWindows[i] * 60000);
      schedule.push({ 
        time: formatTime(currentTime), 
        event: `Nap ${i + 1} starts`,
        notes: i === 0 ? 'First nap is usually the easiest' : undefined
      });
      
      // Add nap duration
      currentTime = new Date(currentTime.getTime() + napDurations[i] * 60000);
      schedule.push({ 
        time: formatTime(currentTime), 
        event: `Nap ${i + 1} ends`,
        notes: undefined
      });
    }
    
    // Calculate ideal bedtime (last wake window before bed)
    const lastWakeWindow = wakeWindows[wakeWindows.length - 1];
    const idealBedtime = new Date(currentTime.getTime() + lastWakeWindow * 60000);
    
    schedule.push({ 
      time: formatTime(new Date(idealBedtime.getTime() - 30 * 60000)), 
      event: 'Bedtime routine starts',
      notes: 'Dim lights, calm activities, bath if you like'
    });
    
    schedule.push({ 
      time: formatTime(idealBedtime), 
      event: 'In crib, lights out',
      notes: 'Drowsy but awake'
    });
    
    return { schedule, recommendedNaps, idealBedtime: formatTime(idealBedtime) };
  };

  const method = getRecommendedMethod();
  const { schedule, recommendedNaps, idealBedtime } = generateSchedule();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-48">
      {/* Header */}
      <div className="p-6 text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-10 w-10 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          {assessment.babyName}'s Sleep Plan
        </h1>
        <p className="text-slate-500">
          Personalized for your family based on your assessment
        </p>
        <button 
          onClick={onEditAssessment}
          className="text-sm text-indigo-600 mt-2 hover:underline"
        >
          Edit assessment →
        </button>
      </div>

      <div className="px-6 space-y-4">
        {/* Summary Card */}
        <Card className="border-none shadow-md bg-white">
          <CardContent className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Baby</span>
                <span className="font-medium text-slate-800">{assessment.babyName}, {assessment.babyAgeMonths}mo</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Main challenges</span>
                <span className="font-medium text-slate-800 text-right">{assessment.mainProblems.length} identified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Night wakings</span>
                <span className="font-medium text-slate-800">{assessment.nightWakings}x per night</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Your comfort level</span>
                <span className="font-medium text-slate-800">
                  {assessment.cryingTolerance <= 2 ? 'Very gentle' : 
                   assessment.cryingTolerance === 3 ? 'Balanced' :
                   assessment.cryingTolerance === 4 ? 'Structured' : 'Direct'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Method */}
        <Card className="border-none shadow-md bg-indigo-600 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Recommended approach</span>
            </div>
            <h2 className="text-xl font-bold mb-2">{method.name}</h2>
            <p className="text-indigo-100 text-sm mb-4">{method.description}</p>
            
            <div className="bg-indigo-500/50 rounded-lg p-3">
              <p className="text-sm">
                <strong>Why this for you:</strong> {method.whyForYou}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* The Science - NEW SECTION */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <button
              onClick={() => setShowScience(!showScience)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-slate-800">The Science Behind This Method</span>
              </div>
              {showScience ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>
            
            {!showScience && (
              <p className="text-sm text-slate-500 mt-2">
                Research-backed evidence on why this works and how it affects your child
              </p>
            )}
            
            {showScience && (
              <div className="mt-4 space-y-6">
                {/* Overview */}
                <div>
                  <p className="text-slate-700 text-sm leading-relaxed">{method.science.overview}</p>
                </div>

                {/* How It Works (Mechanism) */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-indigo-600" />
                    <h4 className="font-medium text-slate-800">How It Works in the Brain</h4>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{method.science.mechanism}</p>
                </div>

                {/* Research */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">📚 What the Research Says</h4>
                  <div className="space-y-3">
                    {method.science.research.map((study, i) => (
                      <div key={i} className="flex items-start gap-3 bg-emerald-50 rounded-lg p-3">
                        <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-emerald-700">{i + 1}</span>
                        </div>
                        <p className="text-sm text-slate-700">{study}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Child Outcomes */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-slate-800">Effects on Your Child</h4>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <ul className="space-y-2">
                      {method.science.childOutcomes.map((outcome, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">✓</span>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Parent Benefits */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">💜 Benefits for You</h4>
                  <ul className="space-y-2">
                    {method.science.parentBenefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Concerns */}
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">❓ Common Concerns Addressed</h4>
                  <div className="space-y-4">
                    {method.science.commonConcerns.map((item, i) => (
                      <div key={i} className="border-l-4 border-amber-400 pl-4 py-2">
                        <p className="font-medium text-slate-800 text-sm mb-1">"{item.concern}"</p>
                        <p className="text-sm text-slate-600">{item.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <button
              onClick={() => setShowFullPlan(!showFullPlan)}
              className="w-full flex items-center justify-between"
            >
              <span className="font-medium text-slate-800">Step-by-Step Instructions</span>
              {showFullPlan ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>
            
            {showFullPlan && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  {method.howItWorks.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-indigo-600">{i + 1}</span>
                      </div>
                      <p className="text-slate-600 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <p className="font-medium text-slate-700 mb-2">What to expect:</p>
                  <ul className="space-y-1">
                    {method.whatToExpect.map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-indigo-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optimal Schedule */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-5">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                <span className="font-medium text-slate-800">Your optimal schedule</span>
              </div>
              {showSchedule ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>
            
            {!showSchedule && (
              <p className="text-sm text-slate-500 mt-2">
                {recommendedNaps} naps • Ideal bedtime: {idealBedtime}
              </p>
            )}
            
            {showSchedule && (
              <div className="mt-4">
                {assessment.currentNapCount !== recommendedNaps && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <p className="text-sm text-amber-700">
                        You mentioned {assessment.currentNapCount} naps, but at {assessment.babyAgeMonths} months, {recommendedNaps} naps is usually better. Try this schedule for a week.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                  <div className="space-y-4">
                    {schedule.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          item.event.includes('wake') ? 'bg-amber-100' :
                          item.event.includes('Nap') && item.event.includes('starts') ? 'bg-indigo-100' :
                          item.event.includes('Nap') && item.event.includes('ends') ? 'bg-sky-100' :
                          item.event.includes('routine') ? 'bg-purple-100' :
                          'bg-slate-800'
                        }`}>
                          {item.event.includes('wake') || (item.event.includes('Nap') && item.event.includes('ends')) ? 
                            <Sun className={`h-4 w-4 ${item.event === 'Morning wake' ? 'text-amber-600' : 'text-sky-600'}`} /> :
                           item.event.includes('Nap') && item.event.includes('starts') ? 
                            <Moon className="h-4 w-4 text-indigo-600" /> :
                           item.event.includes('routine') ?
                            <Clock className="h-4 w-4 text-purple-600" /> :
                            <Moon className="h-4 w-4 text-white" />
                          }
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-800">{item.event}</p>
                            <p className="text-sm text-slate-500">{item.time}</p>
                          </div>
                          {item.notes && (
                            <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Night 1 Instructions */}
        <Card className="border-none shadow-md bg-slate-800 text-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="h-5 w-5" />
              <span className="font-bold">Night 1 Instructions</span>
            </div>
            <div className="space-y-3">
              {method.nightOneInstructions.map((instruction, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium">{i + 1}</span>
                  </div>
                  <p className="text-slate-200 text-sm">{instruction}</p>
                </div>
              ))}
            </div>
            
            {method.checkInIntervals && (
              <div className="mt-4 p-3 bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-300 mb-2">
                  <strong>Tonight's check-in intervals:</strong>
                </p>
                <div className="flex gap-2">
                  {method.checkInIntervals.map((interval, i) => (
                    <div key={i} className="bg-slate-600 px-3 py-1 rounded-full text-sm">
                      {interval} min
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Notes */}
        {assessment.medicalConcerns.some(c => c !== 'none') && (
          <Card className="border-none shadow-sm bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 mb-1">Medical considerations</p>
                  <p className="text-sm text-blue-700">
                    You mentioned some health concerns. Always check with your pediatrician before starting sleep training, especially with reflux or other medical conditions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Commitment */}
        <Card className={`border-2 transition-colors ${committed ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200'}`}>
          <CardContent className="p-5">
            <button
              onClick={() => setCommitted(!committed)}
              className="w-full flex items-center gap-4"
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                committed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
              }`}>
                {committed && <CheckCircle2 className="h-5 w-5 text-white" />}
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-slate-800">I commit to trying this for 5 nights</p>
                <p className="text-sm text-slate-500">Consistency is key — results usually show by night 3-5</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Start Button - positioned above main nav */}
      <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-md mx-auto">
          <Button
            onClick={onStartProgram}
            disabled={!committed}
            className={`w-full py-6 text-lg ${
              committed 
                ? 'bg-indigo-600 hover:bg-indigo-700' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {committed ? (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Start Tonight
              </>
            ) : (
              'Make your commitment above ↑'
            )}
          </Button>
        </div>
      </div>

      {/* Floating Nunu "Here to help" prompt */}
      {showNunuPrompt && onOpenChat && (
        <div className="fixed bottom-44 right-4 z-50 animate-in slide-in-from-right duration-500">
          <div className="relative">
            {/* Speech bubble */}
            <button
              onClick={() => {
                onOpenChat();
                setShowNunuPrompt(false);
              }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-3 pr-4 flex items-center gap-3 hover:shadow-xl transition-shadow"
            >
              {/* Nunu face */}
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/nunu-logo.svg" alt="Nunu" className="w-10 h-10" />
              </div>
              {/* Message */}
              <div className="text-left">
                <p className="text-sm font-medium text-slate-800">Here to help 💜</p>
                <p className="text-xs text-slate-500">Tap to chat with me</p>
              </div>
            </button>
            {/* Close button */}
            <button
              onClick={() => setShowNunuPrompt(false)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center text-slate-500 text-xs"
            >
              ✕
            </button>
            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-slate-200 transform rotate-45" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepPlan;
