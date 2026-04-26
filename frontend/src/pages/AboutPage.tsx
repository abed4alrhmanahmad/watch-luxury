import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { motion } from "framer-motion";
import { Award, Clock, Globe, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const stats = [
  { icon: Clock, value: "1987", label: "Founded" },
  { icon: Globe, value: "45+", label: "Countries" },
  { icon: Users, value: "500K+", label: "Customers" },
  { icon: Award, value: "120+", label: "Awards" },
];

const team = [
  { name: "Alexander Laurent", role: "Founder & CEO", image: "data:image/jpeg;base64,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" },
  { name: "Marcus Webb", role: "Master Horologist", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBUDjcZlq80kSzc2QgT0LZ0JOizZib8x_iHw&s" },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <CartDrawer />

    {/* Hero */}
    <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=1400&h=800&fit=crop"
        alt="ChronoLux workshop"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-espresso/60" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-primary-foreground px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-heading text-4xl md:text-6xl font-bold mb-4"
        >
          Our Story
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-body text-lg md:text-xl max-w-2xl text-primary-foreground/80"
        >
          Crafting timeless elegance since 1987
        </motion.p>
      </div>
    </section>

    {/* Story */}
    <section className="container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            A Legacy of Precision & Luxury
          </h2>
          <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
            <p>
              Founded in Geneva in 1987 by master horologist Alexander Laurent, ChronoLux was born from a singular vision: to create timepieces that transcend mere functionality and become works of art.
            </p>
            <p>
              Every ChronoLux watch is the product of hundreds of hours of meticulous craftsmanship. Our artisans combine centuries-old Swiss watchmaking traditions with cutting-edge technology, resulting in timepieces that are both mechanically exceptional and aesthetically breathtaking.
            </p>
            <p>
              Today, ChronoLux is recognized worldwide as a symbol of refined taste and uncompromising quality. From the boardroom to the ballroom, our watches accompany life's most important moments.
            </p>
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}>
          <img
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=700&fit=crop"
            alt="Watch craftsmanship"
            className="rounded-lg w-full h-[400px] md:h-[500px] object-cover shadow-xl"
          />
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="bg-espresso text-primary-foreground py-16">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <motion.div key={label} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}>
            <Icon className="w-8 h-8 text-gold-light mx-auto mb-3" />
            <p className="font-heading text-3xl md:text-4xl font-bold">{value}</p>
            <p className="text-sm text-primary-foreground/60 tracking-wider uppercase mt-1">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Values */}
    <section className="container py-16 md:py-24">
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">Our Values</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Craftsmanship", desc: "Every component is assembled by hand, tested rigorously, and finished to perfection by our master watchmakers." },
          { title: "Innovation", desc: "We push the boundaries of horology, integrating patented materials and movements that set new industry standards." },
          { title: "Sustainability", desc: "From ethically sourced materials to carbon-neutral workshops, we are committed to responsible luxury." },
        ].map((v, i) => (
          <motion.div
            key={v.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={i}
            variants={fadeUp}
            className="bg-card border border-border rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
          >
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">{v.title}</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Team */}
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">The Team Behind the Craft</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((person, i) => (
            <motion.div key={person.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp} className="text-center">
              <img src={person.image} alt={person.name} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 shadow-md" />
              <h4 className="font-heading text-lg font-bold text-foreground">{person.name}</h4>
              <p className="text-sm text-muted-foreground">{person.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default AboutPage;
