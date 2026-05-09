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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { QuestionType } from "../../enums/questionType.enum";

const initAnswersFromQuestions = (questions) =>
  questions.map((currentQuestion) => {
    const currentType = String(currentQuestion.type || "").toLowerCase();
    if (currentType === "multi") return [];
    if (currentType === "single") return "";
    if (currentType === "boolean") return false;
    return null;
  });

const Onboarding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const res = await api.get(`/quiz/questions`);
        const data = res.data?.questions || [];
        if (!alive) return;
        setQuestions(data);
        setAnswers(initAnswersFromQuestions(data));
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Couldn't load questions");
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const setAnswerAt = (currentIndex, value) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = value;
      return copy;
    });
  };

  const toggleMulti = (currentIndex, option) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[currentIndex])
        ? [...prev[currentIndex]]
        : [];
      const hit = current.indexOf(option);
      if (hit >= 0) current.splice(hit, 1);
      else current.push(option);
      const copy = [...prev];
      copy[currentIndex] = current;
      return copy;
    });
  };

  const complete = useMemo(() => {
    if (!questions.length) return false;
    return questions.every((q, i) => {
      const a = answers[i];
      const t = String(q.type || "").toLowerCase();
      switch (t) {
        case "multi":
        case QuestionType.MULTI:
          return Array.isArray(a) && a.length > 0;
        case "single":
        case QuestionType.SINGLE:
          return typeof a === "string" && a.trim() !== "";
        case "boolean":
        case QuestionType.BOOLEAN:
          return typeof a === "boolean";
        default:
          return false;
      }
    });
  }, [questions, answers]);

  const answeredCount = useMemo(() => {
    return questions.reduce((acc, q, i) => {
      const a = answers[i];
      const t = String(q.type || "").toLowerCase();
      switch (t) {
        case "multi":
        case QuestionType.MULTI:
          return acc + (Array.isArray(a) && a.length > 0 ? 1 : 0);
        case "single":
        case QuestionType.SINGLE:
          return acc + (typeof a === "string" && a.trim() !== "" ? 1 : 0);
        case "boolean":
        case QuestionType.BOOLEAN:
          return acc + (typeof a === "boolean" ? 1 : 0);
        default:
          return acc;
      }
    }, 0);
  }, [questions, answers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError("");

    try {
      const payload = {
        answers: questions.reduce((acc, q, i) => {
          const t = String(q.type || "").toLowerCase();
          const val = answers[i];
          if (t === "multi") {
            const arr = Array.isArray(val) ? val : [];
            acc[q.id] = arr;
          } else if (t === "single") {
            acc[q.id] = typeof val === "string" ? val : "";
          } else if (t === "boolean") {
            acc[q.id] = !!val;
          }
          return acc;
        }, {}),
      };

      const res = await api.post(`/quiz/answers`, payload);

      if (res.data?.ok) {
        setSubmitted(true);
        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("Unexpected response saving preferences");
      }
    } catch (err) {
      setError(err?.message || "Submission failed");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Onboarding Page
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
                key={`${currentQuestion.id || currentIndex}`}
                variant="outlined"
                sx={{ borderRadius: 3 }}
              >
                <CardContent>
                  {String(currentQuestion.type).toLowerCase() !== "boolean" && (
                    <FormLabel component="legend">
                      <Typography variant="h6">
                        {currentQuestion.question}
                      </Typography>
                    </FormLabel>
                  )}

                  {/* SINGLE */}
                  {String(currentQuestion.type).toLowerCase() === "single" && (
                    <FormControl component="fieldset" sx={{ mt: 1 }}>
                      <RadioGroup
                        value={answers[currentIndex] ?? ""}
                        onChange={(e) =>
                          setAnswerAt(currentIndex, e.target.value)
                        }
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

                  {/* MULTI */}
                  {String(currentQuestion.type).toLowerCase() === "multi" && (
                    <FormGroup sx={{ mt: 1 }}>
                      {currentQuestion.options?.map((opt) => {
                        const isChecked =
                          Array.isArray(answers[currentIndex]) &&
                          answers[currentIndex].includes(opt);
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

                  {/* BOOLEAN */}
                  {String(currentQuestion.type).toLowerCase() === "boolean" && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <FormLabel component="legend" sx={{ mr: 1 }}>
                        <Typography variant="h6">
                          {currentQuestion.question}
                        </Typography>
                      </FormLabel>
                      <Switch
                        checked={!!answers[currentIndex]}
                        onChange={(e) =>
                          setAnswerAt(currentIndex, e.target.checked)
                        }
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
