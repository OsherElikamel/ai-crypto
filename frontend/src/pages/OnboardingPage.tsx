import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getQuestions, submitAnswers } from "../services/quiz.service.ts";
import type { Question } from "../types/index.ts";

type AnswerValue = string[] | string | boolean | null;

const initAnswersFromQuestions = (questions: Question[]): AnswerValue[] =>
  questions.map((q) => {
    const t = q.type;
    if (t === "multi") return [] as string[];
    if (t === "single") return "";
    if (t === "boolean") return false;
    return null;
  });

const Onboarding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerValue[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await getQuestions();
        const data: Question[] = res.data?.questions || [];
        if (!alive) return;
        setQuestions(data);
        setAnswers(initAnswersFromQuestions(data));
      } catch (err: unknown) {
        if (!alive) return;
        const message = err instanceof Error ? err.message : "Couldn't load questions";
        setError(message);
      } finally {
        setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  const setAnswerAt = (index: number, value: AnswerValue) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const toggleMulti = (index: number, option: string) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[index]) ? [...(prev[index] as string[])] : [];
      const hit = current.indexOf(option);
      if (hit >= 0) current.splice(hit, 1);
      else current.push(option);
      const copy = [...prev];
      copy[index] = current;
      return copy;
    });
  };

  const complete = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q, i) => {
      const a = answers[i];
      switch (q.type) {
        case "multi":
          return Array.isArray(a) && a.length > 0;
        case "single":
          return typeof a === "string" && a.trim() !== "";
        case "boolean":
          return typeof a === "boolean";
        default:
          return false;
      }
    });
  }, [questions, answers]);

  const answeredCount = useMemo(() => {
    return questions.reduce((acc, q, i) => {
      const a = answers[i];
      switch (q.type) {
        case "multi":
          return acc + (Array.isArray(a) && a.length > 0 ? 1 : 0);
        case "single":
          return acc + (typeof a === "string" && a.trim() !== "" ? 1 : 0);
        case "boolean":
          return acc + (typeof a === "boolean" ? 1 : 0);
        default:
          return acc;
      }
    }, 0);
  }, [questions, answers]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(false);
    setError("");

    try {
      const payload = {
        answers: questions.reduce<Record<string, unknown>>((acc, q, i) => {
          const val = answers[i];
          if (q.type === "multi") {
            acc[q.id] = Array.isArray(val) ? val : [];
          } else if (q.type === "single") {
            acc[q.id] = typeof val === "string" ? val : "";
          } else if (q.type === "boolean") {
            acc[q.id] = !!val;
          }
          return acc;
        }, {}),
      };

      const res = await submitAnswers(payload.answers);

      if (res.data?.ok) {
        setSubmitted(true);
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Unexpected response saving preferences");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission failed";
      setError(message);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Onboarding
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Answer a few quick questions so we can tailor your crypto feed
          </Typography>
        </Box>

        {loading && <LinearProgress aria-label="Loading questions" />}
        {!!error && <Alert severity="error">{error}</Alert>}
        {submitted && <Alert severity="success">Preferences saved!</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {questions.map((currentQuestion, currentIndex) => (
              <Card
                key={currentQuestion.id || currentIndex}
                variant="outlined"
                sx={{ borderRadius: 3 }}
              >
                <CardContent>
                  {currentQuestion.type !== "boolean" && (
                    <FormLabel component="legend">
                      <Typography variant="h6">
                        {currentQuestion.question}
                      </Typography>
                    </FormLabel>
                  )}

                  {currentQuestion.type === "single" && (
                    <FormControl component="fieldset" sx={{ mt: 1 }}>
                      <RadioGroup
                        value={(answers[currentIndex] as string) ?? ""}
                        onChange={(e) => setAnswerAt(currentIndex, e.target.value)}
                      >
                        {currentQuestion.options?.map((opt) => (
                          <FormControlLabel
                            key={opt}
                            value={opt}
                            control={<Radio />}
                            label={opt}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  )}

                  {currentQuestion.type === "multi" && (
                    <FormGroup sx={{ mt: 1 }}>
                      {currentQuestion.options?.map((opt) => {
                        const isChecked =
                          Array.isArray(answers[currentIndex]) &&
                          (answers[currentIndex] as string[]).includes(opt);
                        return (
                          <FormControlLabel
                            key={opt}
                            control={
                              <Checkbox
                                checked={isChecked}
                                onChange={() => toggleMulti(currentIndex, opt)}
                              />
                            }
                            label={opt}
                          />
                        );
                      })}
                    </FormGroup>
                  )}

                  {currentQuestion.type === "boolean" && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FormLabel component="legend" sx={{ mr: 1 }}>
                        <Typography variant="h6">
                          {currentQuestion.question}
                        </Typography>
                      </FormLabel>
                      <Switch
                        checked={!!answers[currentIndex]}
                        onChange={(e) => setAnswerAt(currentIndex, e.target.checked)}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {answers[currentIndex] ? "Yes" : "No"}
                      </Typography>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            ))}

            {!!questions.length && (
              <>
                <Divider />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    {answeredCount}/{questions.length} answered
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !complete}
                  >
                    Save Preferences
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Onboarding;
