type EmptyStatePageProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function EmptyStatePage({
  eyebrow,
  title,
  description,
}: EmptyStatePageProps) {
  return (
    <section className="soraia-page">
      <header className="soraia-page__header">
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </header>

      <div className="soraia-page__empty">
        <div className="soraia-page__empty-icon">✦</div>
        <div>
          <strong>Esta área será conectada aos seus dados.</strong>
          <p>
            A estrutura da página já está pronta para receber componentes e integração com o Supabase.
          </p>
        </div>
      </div>
    </section>
  );
}
